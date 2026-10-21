"""
RAG Chain Integration with Groq LLM and LangChain
Handles multilingual response generation with retrieved context
"""

import os
from typing import List, Dict, Any, Optional
from enum import Enum

try:
    from langchain_groq import ChatGroq
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.output_parsers import StrOutputParser
except ImportError:
    ChatGroq = None
    ChatPromptTemplate = None
    StrOutputParser = None

from prompts import SYSTEM_PROMPTS, USER_TEMPLATES


# ============================================================
# LANGUAGE ENUMS & PROMPTS
# ============================================================

class Language(str, Enum):
    """Supported languages"""
    FR = "fr"
    AR = "ar"
    EN = "en"


# ============================================================
# RAG CHAIN CLASS
# ============================================================

class AmenBankRAGChain:
    """RAG chain for Amen Bank chatbot with Groq LLM"""
    
    def __init__(self, language: Language = Language.FR, model: str = "mixtral-8x7b-32768"):
        """
        Initialize RAG chain
        
        Args:
            language: Default language for responses
            model: Groq model ID (default: mixtral-8x7b-32768)
        """
        self.language = language
        self.model = model
        self.llm = None
        self.chain = None
        
        self._initialize_chain()
    
    def _initialize_chain(self):
        """Initialize LangChain with Groq LLM (lazy-loaded)"""
        # Don't initialize on import - do it on first use
        # This prevents slow startup times
        print(f"⏱ RAG chain ready (LLM initialization deferred)")
        self.llm = None
        self.chain = None

        if ChatGroq is not None and os.getenv("GROQ_API_KEY"):
            try:
                self.llm = ChatGroq(
                    groq_api_key=os.getenv("GROQ_API_KEY"),
                    model_name=self.model,
                    temperature=float(os.getenv("GROQ_TEMPERATURE", "0.2")),
                )
            except Exception as exc:
                print(f"LLM initialization skipped: {exc}")
    
    def generate_response(
        self,
        question: str,
        context: List[Dict[str, Any]],
        language: Optional[Language] = None,
    ) -> str:
        """
        Generate response using RAG pipeline
        
        Args:
            question: User question
            context: Retrieved FAQ chunks
            language: Response language (defaults to self.language)
            
        Returns:
            Generated response text
        """
        if language is None:
            language = self.language
        else:
            self.language = language
        
        # Format context
        context_text = self._format_context(context)
        
        if self.llm is None:
            return self._generate_template_response(question, context_text, language)
        
        # Use LLM
        try:
            return self._generate_llm_response(question, context_text, language)
        except Exception as e:
            print(f"LLM error: {e}. Falling back to template.")
            return self._generate_template_response(question, context_text, language)
    
    def _format_context(self, context: List[Dict[str, Any]]) -> str:
        """
        Format retrieved chunks into context string (clean answer text only).
        Returns only the FIRST (most relevant) chunk to provide a focused answer.
        Removes category prefix and question, keeping only the answer text.
        
        Args:
            context: List of retrieved chunks
            
        Returns:
            Formatted answer text only (cleaned)
        """
        if not context:
            template = {
                Language.FR: "Aucune information pertinente trouvée.",
                Language.AR: "لم يتم العثور على معلومات ذات صلة.",
                Language.EN: "No relevant information found.",
            }
            return template.get(self.language, template[Language.EN])
        
        # Use only the FIRST (most relevant) chunk
        text = context[0].get("text", "").strip()
        
        if not text:
            template = {
                Language.FR: "Aucune information pertinente trouvée.",
                Language.AR: "لم يتم العثور على معلومات ذات صلة.",
                Language.EN: "No relevant information found.",
            }
            return template.get(self.language, template[Language.EN])
        
        # Text format is "category. question\nanswer"
        # First, remove the category prefix
        lines = text.split('\n', 1)
        first_line = lines[0]
        
        # Remove category prefix (e.g., "particuliers. " -> "")
        if '. ' in first_line:
            parts = first_line.split('. ', 1)
            # If first part looks like a category (lowercase word), remove it
            if len(parts) > 1 and parts[0] and parts[0][0].islower():
                # Now we have just the question in first_line
                if len(lines) > 1:
                    # Return the answer part (second line onwards)
                    return lines[1].strip()
                else:
                    # No answer part, return the question (unlikely but handle it)
                    return parts[1].strip()
        
        # If no category prefix found, return the text as-is
        return text.strip()
    
    def _generate_template_response(
        self,
        question: str,
        context: str,
        language: Language,
    ) -> str:
        """
        Generate response from template (mock mode)
        
        Args:
            question: User question
            context: Formatted context
            language: Response language
            
        Returns:
            Template-based response
        """
        template = USER_TEMPLATES[language]
        
        # Check if context is empty or no relevant information found
        if not context or "No relevant information found" in context:
            return {
                Language.FR: "Je n'ai pas trouvé d'information suffisante dans la FAQ pour répondre avec certitude. Veuillez contacter une agence Amen Bank ou le support pour obtenir une réponse précise.",
                Language.AR: "لم أجد معلومات كافية في الأسئلة الشائعة للرد بثقة. يرجى التواصل مع فرع بنك آمن أو الدعم للحصول على إجابة دقيقة.",
                Language.EN: "I could not find enough information in the FAQ to answer with confidence. Please contact an Amen Bank branch or support team for a precise answer.",
            }[language]
        
        # When LLM is not available, return a reformulated answer
        # (category prefix and metadata have already been removed in _format_context)
        answer = context.strip()
        return self._reformulate_answer(answer, language)

    def _reformulate_answer(self, answer: str, language: Language) -> str:
        """
        Apply a simple language-specific template to the FAQ answer to make it
        sound like a concise, user-facing response.
        """
        if not answer:
            templates = {
                Language.FR: "Je n'ai pas trouvé d'information pertinente dans la FAQ.",
                Language.AR: "لم أجد معلومات ذات صلة في الأسئلة المتكررة.",
                Language.EN: "I couldn't find relevant information in the FAQ.",
            }
            return templates.get(language, templates[Language.EN])

        # If an LLM is available, ask it to polish the answer into a friendly tone
        if self.llm is not None and ChatPromptTemplate is not None and StrOutputParser is not None:
            try:
                polished = self._polish_with_llm(answer, language)
                if polished and isinstance(polished, str):
                    return polished
            except Exception as e:
                print(f"LLM polish failed: {e}. Falling back to template reformulation.")

        # Fallback simple templates
        if language == Language.FR:
            # Ensure the answer is a complete sentence
            if not answer.endswith('.') and len(answer) < 240:
                answer = answer.rstrip() + '.'
            return answer
        if language == Language.AR:
            return answer
        # Default to English
        return answer

    def _polish_with_llm(self, answer: str, language: Language) -> str:
        """
        Use the Groq LLM to rewrite an FAQ answer in a concise, friendly tone.
        Falls back to returning the original answer on any failure.
        """
        if ChatPromptTemplate is None or StrOutputParser is None or self.llm is None:
            return answer

        system_prompt = SYSTEM_PROMPTS.get(language, SYSTEM_PROMPTS[Language.FR])
        # Craft a targeted user prompt for rewriting while preserving facts and controlling tone/length
        user_prompt = (
            "Réécris la réponse FAQ suivante en un style naturel, chaleureux et professionnel, sans dépasser 40 mots. "
            "Ne rajoute aucune information, préserve strictement les faits, et répond uniquement par la formulation réécrite.\n\nRéponse à réécrire : {answer}"
        ) if language == Language.FR else (
            "Rewrite the following FAQ answer in a natural, friendly, and professional tone, using no more than 40 words. "
            "Do not add any new information; preserve facts exactly and reply only with the rewritten answer.\n\nAnswer: {answer}"
        )

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_prompt),
        ])

        chain = prompt | self.llm | StrOutputParser()
        try:
            response = chain.invoke({"answer": answer})
            return response
        except Exception as e:
            print(f"Error invoking LLM polish chain: {e}")
            return answer
    
    def _generate_llm_response(
        self,
        question: str,
        context: str,
        language: Language,
    ) -> str:
        """
        Generate response using Groq LLM
        
        Args:
            question: User question
            context: Formatted context
            language: Response language
            
        Returns:
            LLM-generated response
        """
        # Create prompt
        system_prompt = SYSTEM_PROMPTS[language]
        user_template = USER_TEMPLATES[language]
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_template),
        ])
        
        # Create chain
        chain = prompt | self.llm | StrOutputParser()
        
        # Generate response
        response = chain.invoke({
            "context": context,
            "question": question,
        })
        
        return response
    
    def get_response_metadata(
        self,
        context: List[Dict[str, Any]],
    ) -> Dict[str, Any]:
        """
        Generate metadata about the response
        
        Args:
            context: Retrieved chunks
            
        Returns:
            Metadata dict with confidence, sources, etc.
        """
        if not context:
            return {
                "has_context": False,
                "confidence": 0.3,
                "num_sources": 0,
                "avg_relevance": 0.0,
            }
        
        relevances = [chunk.get("relevance", 0) for chunk in context]
        
        return {
            "has_context": True,
            "confidence": min(0.95, 0.5 + sum(relevances) / len(relevances) * 0.4),
            "num_sources": len(context),
            "avg_relevance": sum(relevances) / len(relevances),
            "sources": [
                {
                    "text": chunk.get("text", "")[:150],
                    "relevance": chunk.get("relevance", 0),
                }
                for chunk in context[:3]
            ],
        }


# ============================================================
# UTILITY FUNCTIONS
# ============================================================

def create_rag_chain(language: Language = Language.FR) -> AmenBankRAGChain:
    """Factory function to create RAG chain"""
    return AmenBankRAGChain(language=language)


def validate_language(lang_str: str) -> Language:
    """Validate and convert language string to Language enum"""
    try:
        return Language(lang_str.lower())
    except ValueError:
        return Language.FR  # Default to French

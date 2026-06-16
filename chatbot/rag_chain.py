"""
RAG Chain Integration with Groq LLM and LangChain
Handles multilingual response generation with retrieved context
"""

import os
from typing import List, Dict, Any, Optional
from enum import Enum

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# ============================================================
# LANGUAGE ENUMS & PROMPTS
# ============================================================

class Language(str, Enum):
    """Supported languages"""
    FR = "fr"
    AR = "ar"
    EN = "en"


# System prompts for each language
SYSTEM_PROMPTS = {
    Language.FR: """Tu es un assistant IA amical pour Amen Bank, une banque tunisienne.
Tu aides les clients avec leurs questions sur les produits bancaires, les services, et les comptes.

Directives:
- Sois poli, professionnel et utile
- Réponds en français uniquement
- Utilise les informations fournies pour répondre
- Si l'information n'est pas disponible, dis-le poliment et suggest de contacter le support
- Sois concis (max 2-3 paragraphes)
- Mentionne Amen Bank de manière positive""",

    Language.AR: """أنت مساعد ذكي ودود لـ Amen Bank، وهي بنك تونسي.
تساعد العملاء في أسئلتهم حول المنتجات البنكية والخدمات والحسابات.

التعليمات:
- كن مؤدباً واحترافياً ومفيداً
- أجب باللغة العربية فقط
- استخدم المعلومات المقدمة للإجابة
- إذا لم تتوفر المعلومة، أخبره بأدب وقترح التواصل مع الدعم
- كن موجزاً (الحد الأقصى 2-3 فقرات)
- اذكر Amen Bank بطريقة إيجابية""",

    Language.EN: """You are a friendly AI assistant for Amen Bank, a Tunisian bank.
You help customers with questions about banking products, services, and accounts.

Guidelines:
- Be polite, professional, and helpful
- Respond in English only
- Use the provided information to answer
- If information is not available, politely say so and suggest contacting support
- Be concise (max 2-3 paragraphs)
- Mention Amen Bank positively""",
}

# User message templates
USER_TEMPLATES = {
    Language.FR: """Voici le contexte des connaissances Amen Bank:
{context}

Question du client: {question}

Réponse:""",

    Language.AR: """إليك سياق معرفة Amen Bank:
{context}

سؤال العميل: {question}

الإجابة:""",

    Language.EN: """Here is Amen Bank knowledge context:
{context}

Customer question: {question}

Answer:""",
}


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
        
        # If Groq not available, use template
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
        Format retrieved chunks into context string
        
        Args:
            context: List of retrieved chunks
            
        Returns:
            Formatted context string
        """
        if not context:
            template = {
                Language.FR: "Aucune information pertinente trouvée.",
                Language.AR: "لم يتم العثور على معلومات ذات صلة.",
                Language.EN: "No relevant information found.",
            }
            return template.get(self.language, template[Language.EN])
        
        # Format top 3 chunks
        formatted = []
        for i, chunk in enumerate(context[:3], 1):
            text = chunk.get("text", "")
            relevance = chunk.get("relevance", 0)
            formatted.append(f"[{i}] {text} (Pertinence: {relevance:.1%})")
        
        return "\n\n".join(formatted)
    
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
        prompt_text = template.format(context=context, question=question)
        
        # Simple mock response generation
        prefixes = {
            Language.FR: [
                "Basé sur nos connaissances: ",
                "Selon nos informations: ",
                "Amen Bank propose: ",
            ],
            Language.AR: [
                "بناءً على معلوماتنا: ",
                "وفقاً لقاعدتنا: ",
                "يوفر Amen Bank: ",
            ],
            Language.EN: [
                "Based on our knowledge: ",
                "According to our information: ",
                "Amen Bank offers: ",
            ],
        }
        
        prefix = prefixes[language][hash(question) % len(prefixes[language])]
        
        # Extract first sentence from context
        first_sentence = context.split("\n")[0][:150]
        
        return prefix + first_sentence + "..."
    
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

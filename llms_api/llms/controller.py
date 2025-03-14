from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
# from langchain_core.tools import tool

# Getting the access keys for the llms
from dotenv import load_dotenv
import os

load_dotenv()
# genai_key = os.getenv("GOOGLE_GENAI_TOKEN")
# deepseek_key = os.getenv("DEEPSEEK_TOKEN")

# This is a external class responsible for getting the context in a practical way
parser = StrOutputParser()

# instantiating the gemini llm
# genai_llm = ChatGoogleGenerativeAI(
#     model="gemini-1.5-pro",
#     api_key = genai_key
# )
groq_llm = ChatGroq(
    model="llama3-8b-8192",
    api_key = os.getenv('GROQ_API_KEY')
)
# Basically, it's the "aplication's logs"

chain = groq_llm
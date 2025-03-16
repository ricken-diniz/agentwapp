from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
# from langchain_core.tools import tool

# Getting the access keys for the llms
from dotenv import load_dotenv
import os

load_dotenv()
# This is a external class responsible for getting the context in a practical way
parser = StrOutputParser()

groq_llm = ChatGroq(
    model="llama3-8b-8192",
    api_key = os.getenv('GROQ_API_KEY')
)
# Basically, it's the "aplication's logs"

chain = groq_llm
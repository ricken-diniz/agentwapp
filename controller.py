from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage, SystemMessage #It's models for facilitate the prompts and logs
# from langchain_core.tools import tool

# Getting the access keys for the llms
from dotenv import load_dotenv
import os

load_dotenv()
genai_key = os.getenv("GOOGLE_GENAI_TOKEN")
groq_key = os.getenv("GROQAI_TOKEN")
# deepseek_key = os.getenv("DEEPSEEK_TOKEN")

# This is a external class responsible for getting the context in a practical way
parser = StrOutputParser()

# instantiating the gemini llm
genai_llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro",
    api_key = genai_key
)
groq_llm = ChatGroq(
    model="llama3-8b-8192",
    api_key = groq_key
)

# Basically, it's the "aplication's logs"
messages = [
    SystemMessage("You are an anget responsible for answer questions"),
    HumanMessage("hi, you're ok?"),
    SystemMessage("Yes, how i can help you?"),
]

chain = groq_llm

def stream_model(user_input: str):
    messages.append(HumanMessage(user_input))
    res = chain.invoke(messages)
    messages.append(SystemMessage(res.content))
    print("Assistent: "+res.content)

while True:
    try:
        user_input = input("User: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Goodbye!")
            break

        stream_model(user_input)
    except:
        # fallback if input() is not available
        user_input = "What do you know about LangGraph?"
        print("User: " + user_input)
        stream_model(user_input)
        break


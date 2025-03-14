from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from langchain_core.messages import SystemMessage, HumanMessage
from .controller import chain

messages = [
    SystemMessage("You are an anget responsible for answer questions"),
    HumanMessage("hi, you're ok?"),
    SystemMessage("Yes, how i can help you?"),
]

def stream_model(user_input: str):
    messages.append(HumanMessage(user_input))
    res = chain.invoke(messages)
    messages.append(SystemMessage(res.content))
    return {
        "message": "Groq IA: "+res.content,
        "status": "success"
    }
#testing

def chat(request, prompt):

    try:
        return JsonResponse(stream_model(prompt))
    except:
        # fallback if input() is not available
        user_input = "What do you know about LangGraph?"
        # print("User: " + user_input)

        return JsonResponse(stream_model(prompt))

def test(request):
    data = {"message": "Hello, World!", "status": "success"}
    return JsonResponse(data)
# Create your views here.

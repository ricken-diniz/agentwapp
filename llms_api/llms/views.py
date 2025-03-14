from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from langchain_core.messages import SystemMessage, HumanMessage
from django.views.decorators.csrf import csrf_exempt
from .controller import chain
import json

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

@csrf_exempt
def chat(request):
    try:
        # load the json body
        data = json.loads(request.body)  # Parse the body to a python dictionary
        print(data['body'])
        try:
            return JsonResponse(stream_model(data['body'])) # consult the whatsappwebapi.js file to know the data attributes
        except:
            # fallback if input() is not available
            user_input = "What do you know about LangGraph?"
            # print("User: " + user_input)

            return JsonResponse(stream_model(data['body']))
    except json.JSONDecodeError:
        return JsonResponse({'erro': 'JSON inválido'}, status=400)



def test(request):
    data = {"message": "Hello, World!", "status": "success"}
    return JsonResponse(data)
# Create your views here.

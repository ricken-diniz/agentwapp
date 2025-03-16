from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from django.views.decorators.csrf import csrf_exempt
from .controller import chain
from .vectordatabase import run_query
import json

chanels = {
}

def stream_model(user_input: json):
    if user_input['from'] in chanels:
        messages = chanels[user_input['from']]
    else:
        messages = [
            SystemMessage("Você é um agente responsável por responder mensagens de uma plataforma de mensages, haverá diferentes conversas e o sistema será responsável por passar os indentificadores de cada uma, para que cada uma possua apenas o contexto e histórico de sua própria conversa. Seu idioma nativo é o Português do Brasil."),
        ]
    prompt = user_input['body']
    messages.append(SystemMessage('O próximo prompt é uma mensagem de '+user_input['from']+' trate como contexto apenas as mensagens de mesma origem'))
    messages.append(HumanMessage(content=prompt,chanel=user_input['from']))
    
    chanels[user_input['from']] = messages

    res = chain.invoke(messages)
    messages.append(AIMessage(res.content))
    return {
        "message": "Groq IA: "+res.content,
        "status": "success"
    }

@csrf_exempt
def chat(request):
    try:
        # load the json body
        data = json.loads(request.body)  # Parse the body to a python dictionary
        print(data['body'])
        try:
            return JsonResponse(stream_model(data)) # consult the whatsappwebapi.js response to know the data attributes
        except:
            # fallback if input() is not available
            user_input = "What do you know about LangGraph?"
            # print("User: " + user_input)

            return JsonResponse(stream_model(data))
    except json.JSONDecodeError:
        return JsonResponse({'erro': 'JSON inválido'}, status=400)


# Create your views here.

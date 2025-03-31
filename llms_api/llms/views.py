from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from django.views.decorators.csrf import csrf_exempt
from .controller import chain
# from .vectordatabase import run_query
from .dbchroma import db
import json
import time

chanels = {
}
user_input_dict = {
}
last_execution_time = 0

def stream_model(user_input: json):
    if user_input['from'] in chanels:
        messages = chanels[user_input['from']]
    else:
        messages = [
            SystemMessage('Você é um Agente de Inteligência Artificial que deverá responder perguntas, de forma breve (até 2 linhas), de acordo com um contexto'),
            SystemMessage("Você é um agente responsável por responder mensagens de uma plataforma de mensages, haverá diferentes conversas e o sistema será responsável por passar os indentificadores de cada uma, para que cada uma possua apenas o contexto e histórico de sua própria conversa. Seu idioma nativo é o Português do Brasil."),
        ]
    prompt = user_input['body']
    search = db.similarity_search(prompt, k=1)
    res_vectordb = search[0].page_content
    messages.append(SystemMessage('O próximo prompt é uma mensagem de '+user_input['from']+' trate como contexto apenas as mensagens de mesma origem'))
    messages.append(SystemMessage('Contexto: '+ res_vectordb))
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
    global user_input_dict
    global last_execution_time
    now = time.time()
    # load the json body
    if request:
        user_input_dict.append(json.loads(request.body))# Parse the body to a python dictionary
    
    if now - last_execution_time >= 3:
        data = user_input_dict
        last_execution_time = now
        user_input_dict = {}
        try:
            return JsonResponse(stream_model(data)) # consult the whatsappwebapi.js response to know the data attributes
        except json.JSONDecodeError:
            return JsonResponse({'erro': 'JSON inválido'}, status=400)
    else:
        sleep(3)
        chat()
        


# Create your views here.

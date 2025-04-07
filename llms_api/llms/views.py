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

def stream_model(user_input: json):
    user = ''
    for element in user_input:
        if element in chanels:
            user = user_input[element]['from']
            messages = chanels[user_input[element]['from']]
        else:
            messages = [
                SystemMessage('Você é um Agente de Inteligência Artificial que deverá responder perguntas, de forma breve (até 2 linhas), de acordo com um contexto'),
                SystemMessage("Você é um agente responsável por responder mensagens de uma plataforma de mensages, haverá diferentes conversas e o sistema será responsável por passar os indentificadores de cada uma, para que cada uma possua apenas o contexto e histórico de sua própria conversa. Seu idioma nativo é o Português do Brasil."),
                (SystemMessage('O próximo prompt é uma mensagem de '+user_input[element]['from']+' trate como contexto apenas as mensagens de mesma origem'))
            ]
        break
    i = 0
    prompt = ""
    for element in user_input:
        i+=1
        prompt = prompt + "Mensagem "+str(i)+":\n"+ user_input[element]['body']+"\n\n"
        
    search = db.similarity_search(prompt, k=1)
    res_vectordb = search[0].page_content
    messages.append(SystemMessage('Contexto das mensagens: '+ res_vectordb))
    messages.append(HumanMessage(content=prompt,chanel=user))
    
    chanels[user] = messages

    res = chain.invoke(messages)
    messages.append(AIMessage(res.content))
    return {
        "message": "Groq IA: "+res.content,
        "status": "success"
    }

@csrf_exempt
def chat(request):
    # load the json body
    if request:
        data = (json.loads(request.body))# Parse the body to a python dictionary
        print(data)
        try:
            return JsonResponse(stream_model(data)) # consult the whatsappwebapi.js response to know the data attributes
        except json.JSONDecodeError:
            return JsonResponse({'erro': 'JSON inválido'}, status=400)
   
        


# Create your views here.

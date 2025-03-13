from langserve import RemoteRunnable
from langchain_core.messages import SystemMessage, HumanMessage

remote_chain = RemoteRunnable('http://localhost:8000/chat')

messages = [
    SystemMessage("You are an anget responsible for answer questions"),
    HumanMessage("hi, you're ok?"),
    SystemMessage("Yes, how i can help you?"),
]

def stream_model(user_input: str):
    messages.append(HumanMessage(user_input))
    res = remote_chain.invoke(messages)
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
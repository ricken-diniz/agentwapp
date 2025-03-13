from langchain_core.messages import HumanMessage, SystemMessage #It's models for facilitate the prompts and logs
from controller import chain
from fastapi import FastAPI
from langserve import add_routes

app = FastAPI(
    tittle='LangChain Server',
    version='1.0',
    description='i dont wanna put a description'
)

add_routes(app, chain, path='/chat')

if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host='localhost', port=8000)


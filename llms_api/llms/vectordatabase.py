'''
    ÁREA EM CONSTRUÇÃO

    - Lógica sendo pensada meticulosamente para diminuir os custos
    com recursos e processamento, visto que a cada troca de requisições
    o código será processado.
    
'''

from pymilvus import MilvusClient
from pymilvus import model

embedding_fn = model.DefaultEmbeddingFunction()
client = MilvusClient("milvus_demo.db")

#creating a collection, this collection can be inserted at database
if client.has_collection(collection_name="demo_collection"):
    client.drop_collection(collection_name="demo_collection")
client.create_collection(
    collection_name="demo_collection",
    dimension=768,  # The vectors we will use in this demo has 768 dimensions
)

def run_query(content: dict, **kwargs: str):
    vectors = embedding_fn.encode_documents(content)
    data = [
        {"id": i, "vector": vectors[i], "text": content[i], "subject": "history"}
        for i in range(len(vectors))
    ]

    if 'delete' in kwargs:
        delete(content)
    if 'search' in kwargs:
        search(content)
    if 'insert' in kwargs:
        insert(content)
    if 'update' in kwargs:
        update(content)
    
def search(content: dict):
    #search in database
    
def insert(content: dict):
    #search in database
    
def update(content: dict):
    #search in database
    
def delete(content: dict):
    #search in database
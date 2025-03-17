'''
    ÁREA EM CONSTRUÇÃO

    - Lógica sendo pensada meticulosamente para diminuir os custos
    com recursos e processamento, visto que a cada troca de requisições
    o código será processado.
    
'''

from pymilvus import MilvusClient
from pymilvus import model

embedding_fn = model.DefaultEmbeddingFunction()
client = MilvusClient("milvus_demo.db") # Client for a local database, this can be made with cluster

def run_query(content: dict, **kwargs: str):

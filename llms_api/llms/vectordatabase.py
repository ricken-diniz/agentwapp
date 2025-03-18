'''
    ÁREA EM CONSTRUÇÃO

    - Lógica sendo pensada meticulosamente para diminuir os custos
    com recursos e processamento, visto que a cada troca de requisições
    o código será processado.
    
'''

from pymilvus import MilvusClient, DataType, Function, FunctionType
from pymilvus import model

embedding_fn = model.DefaultEmbeddingFunction()
client = MilvusClient("milvus_demo.db") # Client for a local database, this can be made with cluster


index_params = client.prepare_index_params()

index_params.add_index(
    field_name="dense",
    index_name="dense_index",
    index_type="IVF_FLAT",
    metric_type="IP",
    params={"nlist": 128},
)

index_params.add_index(
    field_name="sparse",
    index_name="sparse_index",
    index_type="SPARSE_INVERTED_INDEX",
    metric_type="BM25",
    params={"inverted_index_algo": "DAAT_MAXSCORE"},
)

bm25_function = Function(
    name="text_bm25_emb",  # Nome da função
    input_field_names=["text"],  # Nome do campo VARCHAR contendo o texto
    output_field_names=["sparse"],  # Nome do campo SPARSE_FLOAT_VECTOR para armazenar os embeddings
    function_type=FunctionType.BM25  # Definir como BM25
)

schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True,
)

if not client.has_collection(collection_name="hybrid_search_collection"):
    schema.add_field(field_name="id", datatype=DataType.INT64, is_primary=True)
    schema.add_field(field_name="text", datatype=DataType.VARCHAR, max_length=1000)
    schema.add_field(field_name="sparse", datatype=DataType.SPARSE_FLOAT_VECTOR)
    schema.add_field(field_name="dense", datatype=DataType.FLOAT_VECTOR, dim=5)
    schema.add_function(bm25_function)

    client.create_collection(
        collection_name="hybrid_search_collection",
        schema=schema,
        index_params=index_params
    )

def run_query(content: dict, **kwargs: str):
    print(content)
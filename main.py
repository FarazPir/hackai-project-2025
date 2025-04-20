from dotenv import load_dotenv
import os
import re
from pydantic import BaseModel
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain.agents import create_tool_calling_agent, AgentExecutor

from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import UnstructuredExcelLoader
from langchain.tools.retriever import create_retriever_tool

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")  # Make sure this variable exists in your .env file!

# Define the Pydantic model
class ResearchResponse(BaseModel):
    topic: str
    summary: str
    sources: list[str]
    tools_used: list[str]

# LLM setup
llm = ChatOpenAI(model="gpt-4o", openai_api_key=openai_api_key)
parser = PydanticOutputParser(pydantic_object=ResearchResponse)

# Updated system instructions
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are a research assistant that will help generate a research paper.
            Use tools if needed and respond in exactly ONE valid JSON object and nothing else.
            Do NOT include multiple objects. Do NOT include explanations. Just return a JSON.
            \n{format_instructions}
            """,
        ),
        ("placeholder", "{chat_history}"),
        ("human", "{query}"),
        ("placeholder", "{agent_scratchpad}"),
    ]
).partial(format_instructions=parser.get_format_instructions())

# Agent setup
agent = create_tool_calling_agent(llm=llm, prompt=prompt, tools=[])
agent_executor = AgentExecutor(agent=agent, tools=[], verbose=False)

# Run query
raw_response = agent_executor.invoke({
    "query": "What is the impact of climate change on polar bear populations?"
})

# Extract and parse a valid JSON object from the output
try:
    output_text = raw_response.get("output", "")
    if isinstance(output_text, list):  # In some versions this is a list
        output_text = output_text[0].get("text", "")

    # Extract the first JSON object using regex
    match = re.search(r'\{[\s\S]*?\}', output_text)
    if match:
        json_like = match.group(0)
        structured_response = parser.parse(json_like)
        print(structured_response)
    else:
        print("No valid JSON found in output:", output_text)

except Exception as e:
    print("Error parsing structured response:", e)



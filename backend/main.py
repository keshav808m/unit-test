import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Update Request Model to include 'language'
class CodeRequest(BaseModel):
    code: str
    language: str  # e.g., "python", "javascript", "java", "cpp"

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",  # <--- Use the version from your checkpy.py list
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0
)

@app.post("/generate")
async def generate_test(request: CodeRequest):
    try:
        # 2. Map Language to Testing Framework
        framework_map = {
            "python": "Pytest",
            "javascript": "Jest",
            "typescript": "Jest",
            "java": "JUnit 5",
            "cpp": "GoogleTest",
            "csharp": "xUnit"
        }
        test_framework = framework_map.get(request.language.lower(), "standard unit testing")

        # 3. Enhanced Prompt for Readability
        prompt = f"""
        You are an expert QA Automation Engineer.
        Write a **{test_framework}** unit test for the following **{request.language}** code.
        
        CRITICAL READABILITY RULES:
        1. **Use the AAA Pattern**: Comment every test with # Arrange, # Act, # Assert sections.
        2. **Docstrings**: Add a summary docstring to every test function explaining WHAT it tests.
        3. **Naming**: Use descriptive test names (e.g., `test_deposit_negative_amount_raises_error`).
        4. **Clean Code**: Do not include markdown (```), just the raw code.
        
        CODE TO TEST:
        {request.code}
        """
        
        response = llm.invoke(prompt)
        return {"test": response.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
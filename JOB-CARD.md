**_What it does:_**

Classifies an image description into fixed categories with structured tags

**_Input:_**

{"description" : "string, 5-300 characters"}

**_Output:_**

{
"category" : one of [animal|landscape|people|object|food|other],
"subject" : "short noun phrase",
"confidence" : 0.0-1.0,
"needs_review": boolean
}

**_When unsure it should:_**

return category "other" with low confidence, not a guess

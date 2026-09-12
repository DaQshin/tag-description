What it does:

Classifies an image description into fixed categories with structured tags

Input:

{"description" : "string, 5-300 characters"}

Output:

{
"category" : one of [animal|landscape|people|object|food|other],
"subject" : "short noun phrase",
"confidence" : 0.0-1.0,
"needs_review": boolean
}

When unsure it should:

return category "other" with low confidence, not a guess

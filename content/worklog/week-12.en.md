### Week 12 Objectives

* Deliver the grand final presentation.
* Complete self-evaluation forms summarizing my journey as an AI/ML Lead.
* Finalize the public repository.
* Celebrate project realization and networking wrap-ups!

### Tasks to be carried out this week

| Day | Task | Start Date | Completion Date | Reference Material |
| --- | --- | --- | --- | --- |
| 1 | - Final Preparation & Tech Check <br>&emsp; + Validated all Backend AppSync / Bedrock connections ahead of demo. <br>&emsp; + Reviewed final slides. | 16/04/2026 | 16/04/2026 | - |
| 2 | - Final Presentation Day! <br>&emsp; + Presented NutriTrack to the FCJ Mentors. <br>&emsp; + Live demo ran seamlessly; Ollie correctly logged voice audio during the live test! | 17/04/2026 | 17/04/2026 | - |
| 3 | 🔥 **MILESTONE:** FINAL PRESENTATION TO MENTORS <br>&emsp; - Self-Evaluation Drafting <br>&emsp; + Completed FCJ rubrics emphasizing Bedrock engineering patterns. <br>&emsp; + Documented the shift from standard backend coding to AI-prompt architecture. | 18/04/2026 | 18/04/2026 | - |
| 4 | - Program Feedback <br>&emsp; + Wrote constructive reviews to program admins. <br>&emsp; + Reflected on the outstanding mentorship. | 19/04/2026 | 19/04/2026 | - |
| 5 | - Knowledge Handover <br>&emsp; + Pushed the entire AWS Workshop instructions. <br>&emsp; + Verified the React App repository `README.md`. | 20/04/2026 | 20/04/2026 | - |
| 6-7 | - Celebration and Network <br>&emsp; + Shared accomplishments on LinkedIn! <br>&emsp; + Congratulated Team NeuraX on an amazing 12 weeks of synergy. | 21/04/2026 | 22/04/2026 | - |

### Week 12 Achievements

* **Final Presentation Success:** The mentors were impressed by our AI architecture — Qwen3-VL 235B on Bedrock for multimodal food analysis, combined with the hybrid DynamoDB fuzzy-match + Bedrock fallback in `processNutrition`. The live demo triggered the DynamoDB → Recipe Generation flawlessly.
* **Architecture Validation:** The team successfully delivered a fully-function AWS Serverless AI application. We didn't just build a mockup; we built an infrastructure.
* **Personal Growth as an AI Specialist:** Transitioned from a foundational understanding of LLMs to actually mastering the integration of Amazon Bedrock Runtime within strict, JSON-output APIs.

### Overall Internship Summary

**12-Week AI Journey Highlights:**

| Phase | Weeks | Key Accomplishments |
| --- | --- | --- |
| Inception | 1-2 | Team setup, basic AWS research, NutriTrack planning |
| Bedrock Integration | 3-6 | Model evaluation, Schema design, first Haiku Voice processing Lambda |
| Logic Construction | 7-8 | Prompt architecture, DynamoDB querying, Sonnet v2 Recipe Lambda |
| Optimization & Polish | 9-10 | AI Coach `Ollie` deployed with 3-mode context injection, Load testing |
| Delivery | 11-12 | Stress-testing inference parameters, Handover documentation, Finals |

**AWS Services Mastered:**

* **Amazon Bedrock** (Qwen3-VL 235B, `ap-southeast-2`) — invoked via AWS SDK for JavaScript (TypeScript) `InvokeModelCommand` in Node.js 22 Lambda
* **AWS Amplify Gen 2** — `defineBackend`, `defineFunction`, `defineData`, `defineAuth`, `defineStorage`, CDK escape hatch for env injection
* **AWS AppSync** — GraphQL schema with 8 DynamoDB models, owner-scoped authorization, real-time subscriptions
* **Amazon Transcribe** — async transcription jobs with `vi-VN` language code, S3 resource policy grant
* **Amazon DynamoDB** — on-demand tables, GSIs, `TransactWriteItems` for friend requests

### Final Reflection

This 12-week FCJ Internship was an absolute gauntlet of Generative AI problem-solving. Diving into Amazon Bedrock wasn't just about calling a model; it was about Prompt Engineering — writing resilient, schema-enforced instructions to force Qwen3-VL 235B to behave like a predictable data extraction module, returning strict JSON on every call.

Collaborating tightly with the Quan (DEV) to link AppSync GraphQL with Lambda handlers in TypeScript — and debugging the CDK escape hatch for env var injection — completely changed my perspective on how rapidly serverless architecture has advanced. I am immensely grateful to the FCJ Mentors and my NeuraX team for navigating this cutting-edge space together.

This concludes the NutriTrack journey! ☁️🚀

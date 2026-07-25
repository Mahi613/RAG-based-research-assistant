import { Paper, ChatMessage } from "./types";

// ─── Mock Research Papers ─────────────────────────────────────────────────────

export const MOCK_PAPERS: Paper[] = [
  {
    id: 1,
    title:
      "Attention Is All You Need: Transformer Architecture and Its Implications for Large-Scale Language Modelling",
    authors: "Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I.",
    year: 2017,
    citations: 87_432,
    journal: "Advances in Neural Information Processing Systems",
    doi: "10.48550/arXiv.1706.03762",
    crn: "CRN-2017-ATT",
    abstract:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelisable and requiring significantly less time to train.",
    tags: ["Transformers", "Attention", "NLP", "Seminal"],
    relevanceScore: 0.98,
  },
  {
    id: 2,
    title:
      "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
    authors: "Devlin, J., Chang, M.-W., Lee, K., & Toutanova, K.",
    year: 2019,
    citations: 62_180,
    journal: "Proceedings of NAACL-HLT",
    doi: "10.48550/arXiv.1810.04805",
    crn: "CRN-2019-BRT",
    abstract:
      "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder Representations from Transformers. Unlike recent language representation models, BERT is designed to pre-train deep bidirectional representations from unlabelled text by jointly conditioning on both left and right context in all layers. As a result, the pre-trained BERT model can be fine-tuned with just one additional output layer to create state-of-the-art models for a wide range of tasks, such as question answering and language inference, without substantial task-specific architecture modifications.",
    tags: ["BERT", "Pre-training", "NLP", "Fine-tuning"],
    relevanceScore: 0.95,
  },
  {
    id: 3,
    title:
      "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
    authors: "Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., Küttler, H., Lewis, M., Yih, W., Rocktäschel, T., Riedel, S., & Kiela, D.",
    year: 2020,
    citations: 14_876,
    journal: "Advances in Neural Information Processing Systems",
    doi: "10.48550/arXiv.2005.11401",
    crn: "CRN-2020-RAG",
    abstract:
      "Large pre-trained language models have been shown to store factual knowledge in their parameters, and achieve state-of-the-art results when fine-tuned on downstream NLP tasks. However, their ability to access and precisely manipulate knowledge is still limited, and hence on knowledge-intensive tasks, their performance lags behind task-specific architectures. Additionally, providing provenance for their decisions and updating their world knowledge remain open research problems. We explore a general-purpose fine-tuning recipe for retrieval-augmented generation (RAG) — models which combine pre-trained parametric and non-parametric memory for language generation.",
    tags: ["RAG", "Retrieval", "Knowledge", "Generation"],
    relevanceScore: 0.91,
  },
  {
    id: 4,
    title:
      "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    authors: "Wei, J., Wang, X., Schuurmans, D., Bosma, M., Ichter, B., Xia, F., Chi, E., Le, Q., & Zhou, D.",
    year: 2022,
    citations: 9_241,
    journal: "Advances in Neural Information Processing Systems",
    doi: "10.48550/arXiv.2201.11903",
    crn: "CRN-2022-COT",
    abstract:
      "We explore how generating a chain of thought — a series of intermediate reasoning steps — significantly improves the ability of large language models to perform complex reasoning. In particular, we show how such reasoning abilities emerge naturally in sufficiently large language models via a simple method called chain-of-thought prompting, where a few chain-of-thought demonstrations are provided as exemplars in prompting. Experiments on three large language models show that chain-of-thought prompting improves performance on a range of arithmetic, commonsense, and symbolic reasoning tasks.",
    tags: ["Chain-of-Thought", "Reasoning", "Prompting", "LLM"],
    relevanceScore: 0.88,
  },
  {
    id: 5,
    title:
      "Constitutional AI: Harmlessness from AI Feedback",
    authors: "Bai, Y., Kadavath, S., Kundu, S., Askell, A., Kernion, J., Jones, A., Chen, A., Goldie, A., Mirhoseini, A., McKinnon, C., Chen, C., Olsson, C., Olah, C., Hernandez, D., Drain, D., Ganguli, D., Li, D., Tran-Johnson, E., Perez, E., Burke, J., Henighan, T., Olsson, C., et al.",
    year: 2022,
    citations: 3_892,
    journal: "arXiv preprint",
    doi: "10.48550/arXiv.2212.08073",
    crn: "CRN-2022-CAI",
    abstract:
      "As AI systems become more capable, we would like to enlist their help to supervise other AIs. We experiment with methods for training a harmless AI assistant through self-improvement, without any human labels identifying harmful outputs. The only human oversight is provided through a list of rules or principles, and so we call the method 'Constitutional AI'. The process involves both a supervised learning and a reinforcement learning phase.",
    tags: ["Alignment", "Safety", "RLHF", "Constitutional AI"],
    relevanceScore: 0.84,
  },
];

// ─── Mock Chat History ────────────────────────────────────────────────────────

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "sys-001",
    role: "system",
    content: "Research session initiated — 23 July 2026 · Query scope: Large Language Model architectures",
    timestamp: "2026-07-23T11:30:00Z",
  },
  {
    id: "usr-001",
    role: "user",
    content:
      "What are the foundational papers I need to read to understand how modern RAG systems build on transformer architectures?",
    timestamp: "2026-07-23T11:31:14Z",
  },
  {
    id: "ast-001",
    role: "assistant",
    content:
      "The intellectual lineage of modern Retrieval-Augmented Generation runs directly through three foundational works. The architecture begins with **Vaswani et al. (2017)**, whose attention-mechanism-based Transformer displaced recurrent networks entirely and established the substrate upon which everything downstream was built.\n\nDevlin's **BERT (2019)** then demonstrated that deep bidirectional pre-training on unlabelled corpora could yield representations fine-tunable across heterogeneous downstream tasks — critically, it proved the general-purpose language model paradigm was viable at scale.\n\nLewis et al. **(2020)** synthesised these threads into RAG proper: combining a parametric memory (the language model) with a non-parametric retrieval index, enabling the system to ground generations in retrieved evidence rather than relying solely on weights. This is the architectural skeleton of virtually every production knowledge-intensive NLP system today.",
    timestamp: "2026-07-23T11:31:44Z",
    references: [1, 2, 3],
  },
  {
    id: "usr-002",
    role: "user",
    content:
      "Can you explain how chain-of-thought prompting relates to the reasoning limitations Wei et al. identified in standard prompting?",
    timestamp: "2026-07-23T11:34:22Z",
  },
  {
    id: "ast-002",
    role: "assistant",
    content:
      "Wei et al. (2022) identified a fundamental constraint: sufficiently complex reasoning tasks require the model to maintain intermediate symbolic state that standard next-token prediction does not surface. Standard prompting collapses the latent reasoning chain into the output distribution without making it legible — the model must 'hold' the arithmetic or logical state in its activations alone.\n\nChain-of-thought addresses this by externalising the reasoning trace into the output sequence itself. Each intermediate step becomes a token-level commitment that conditions all subsequent steps, effectively transforming the problem from one-shot generation into incremental, verifiable symbolic manipulation.\n\nThe crucial finding was emergent: this capability only manifests in models above a certain scale threshold (approximately 100B parameters), suggesting that chain-of-thought is not a learned skill in the traditional fine-tuning sense, but a capacity that requires sufficient model depth to express reliably.",
    timestamp: "2026-07-23T11:35:01Z",
    references: [4],
  },
  {
    id: "usr-003",
    role: "user",
    content:
      "How does Constitutional AI differ from standard RLHF in terms of the human oversight requirement?",
    timestamp: "2026-07-23T11:38:55Z",
  },
  {
    id: "ast-003",
    role: "assistant",
    content:
      "The key distinction is the locus and density of human supervision. Standard RLHF requires human labellers to evaluate individual model outputs at scale — a process that is expensive, slow, inconsistent, and ultimately bounded by human capacity to identify subtle harms.\n\nBai et al.'s **Constitutional AI** relocates human oversight to the level of principles rather than instances. Humans specify a small set of normative rules (the \"constitution\"); the model then critiques and revises its own outputs against those rules in a supervised learning phase, before the revised outputs are used to train a preference model for the RL phase.\n\nThe net effect is that human labour is amortised across the entire training run rather than per output. The tradeoff is that constitutional principles must be specified carefully — the model's self-critique is only as principled as the constitution it applies. This opened active research questions about how to verify that self-critique is genuinely aligned with intended principles rather than superficially compliant.",
    timestamp: "2026-07-23T11:39:38Z",
    references: [5],
  },
];

// ─── Suggested Prompts ────────────────────────────────────────────────────────

export const SUGGESTED_PROMPTS: string[] = [
  "Trace the evolution from attention mechanisms to modern RAG architectures",
  "Compare RLHF and Constitutional AI on safety alignment",
  "What does chain-of-thought prompting reveal about emergent reasoning?",
  "Explain the parametric vs. non-parametric memory distinction in LLMs",
  "Which papers established the scaling law hypothesis?",
];

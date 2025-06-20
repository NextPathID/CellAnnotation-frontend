// eslint-disable-next-line no-unused-vars
import React from "react";

function Documentation() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Cell Annotation Documentation
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding Cell Annotation
          </h2>
          <p className="text-gray-700 mb-4">
            Cell annotation is like giving cells their proper names and
            understanding their roles in the body. Just as we identify people by
            their appearance and behavior, we identify cells by their genetic
            fingerprints - &quot;the genes they express&quot;.
          </p>
          <p className="text-gray-700 mb-4">
            Our system helps researchers identify cell types by analyzing gene
            expression patterns and comparing them to known cell types in
            different tissues of the body.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How We Calculate Scores
          </h2>
          <p className="text-gray-700 mb-4">
            When identifying cells, we use a scoring system that considers three
            important factors:
          </p>

          <div className="mb-6 border-l-4 border-blue-500 pl-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              The Score Formula
            </h3>
            <p className="text-gray-700 mb-2">
              Score = (α × Expression Level) + (β × Expressed in cell) + (γ ×
              Expressed Percentage)
            </p>
            <p className="text-gray-700">
              Where α (alpha), β (beta), and γ (gamma) are weight factors you
              can adjust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">
                Expression Level (α)
              </h4>
              <p className="text-gray-700 mb-2">
                Measures how actively a gene is expressed in a given cell.
              </p>
              <p className="text-gray-700 underline">
                Higher values mean the genes are more active in these cells.
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-green-800 mb-2">
                Expressed in cell (β)
              </h4>
              <p className="text-gray-700 mb-2">
                Indicates whether the gene is present in a particular cell type.
              </p>
              <p className="text-gray-700 underline">
                More cells expressing the genes increases confidence in the
                annotation.
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-bold text-purple-800 mb-2">
                Expressed Percentage (γ)
              </h4>
              <p className="text-gray-700 mb-2">
                Represents the proportion of cells expressing the gene in a
                tissue express these genes.
              </p>
              <p className="text-gray-700 underline">
                Higher percentages suggest the genes are characteristic of this
                cell type.
              </p>
            </div>
          </div>

          <p className="text-gray-700 mb-4">
            All these values are normalized (scaled between 0 and 1) to make
            fair comparisons across different measurements.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Weight Factors Explained
          </h2>
          <p className="text-gray-700 mb-4">
            You can adjust the importance of each factor by changing the weight
            values:
          </p>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Default Values
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Alpha (α) = 2.5</strong>: Expression level has high
                importance
              </li>
              <li>
                <strong>Beta (β) = 0.5</strong>: Expressed in cell has lower
                importance
              </li>
              <li>
                <strong>Gamma (γ) = 1.0</strong>: Expressed Percentage has
                medium importance
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-yellow-800 mb-2">
              When to Adjust Weights?
            </h4>
            <p className="text-gray-700 mb-2">
              <strong>Increase Alpha</strong> when you want to prioritize how
              strongly genes are expressed, regardless of how many cells express
              them.
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Increase Beta</strong> when you want to give more
              importance to genes expressed in many cells, even if expression
              levels are lower.
            </p>
            <p className="text-gray-700">
              <strong>Increase Gamma</strong> when you want to prioritize genes
              that are expressed in a high percentage of cells in the tissue.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How We Filter the Top 10 Cell Types
          </h2>
          <p className="text-gray-700 mb-4">
            After calculating scores for all possible cell types, we:
          </p>

          <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
            <li>
              <strong>Calculate statistics for each cell type</strong>
              <ul className="list-disc list-inside ml-6 mt-2 text-gray-600">
                <li>
                  Mean Score: Average score across all genes in the cluster
                </li>
                <li>
                  Standard Deviation: How much variation exists in the scores
                </li>
                <li>Coefficient of Variation: Measures score consistency</li>
              </ul>
            </li>
            <li>
              <strong>Rank cell types by their mean scores</strong>
            </li>
            <li>
              <strong>Select the top 10 cell types</strong> with the highest
              mean scores
            </li>
            <li>
              <strong>Consider biological relevance</strong> by checking if the
              cell types make sense in the selected tissue
            </li>
          </ol>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-800 mb-2">Why Top 10?</h4>
            <p className="text-gray-700">
              We choose the top 10 to provide a balance between giving you
              enough options to consider while not overwhelming you with too
              many possibilities. The LLM will then help determine which of
              these are most biologically relevant.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How LLM Helps with Annotation
          </h2>
          <p className="text-gray-700 mb-4">
            After we identify the top cell types based on scores, we use
            artificial intelligence to:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-bold text-indigo-800 mb-2">
                Analyze Biological Relevance
              </h4>
              <p className="text-gray-700">
                The LLM evaluates whether the top-scoring cell types make
                biological sense together in the context of the selected{" "}
                <strong>tissue</strong> and <strong>genes</strong>.
              </p>
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <h4 className="font-bold text-pink-800 mb-2">
                Provide Scientific Context
              </h4>
              <p className="text-gray-700">
                The LLM adds scientific knowledge about the cell types, their
                functions, and how they relate to the genes you&apos;re
                studying.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            The LLM Process
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
            <li>Receives the top-scoring cell types and gene information</li>
            <li>
              Analyzes the biological relationships between the cell types
            </li>
            <li>Considers the tissue context and gene functions</li>
            <li>
              Provides the three most likely cell annotations with explanations
            </li>
            <li>Includes scientific references to support the annotations</li>
          </ol>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-bold text-gray-800 mb-2">Models We Use</h4>
            <p className="text-gray-700 mb-2">
              <strong>
                <a
                  href="https://ai.google.dev/gemini-api/docs/models/gemini#gemini-1.5-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Gemini 1.5 Pro (Default)
                </a>
              </strong>
              : Google&apos;s advanced LLM model with extensive knowledge of
              biology and cell types.
            </p>
            <p className="text-gray-700">
              <strong>
                <a
                  href="https://platform.openai.com/docs/models#gpt-4o-mini"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GPT-4o Mini
                </a>
              </strong>
              : OpenAI&apos;s model that offers an alternative perspective on
              cell annotation.
            </p>
            <div className="overflow-x-auto mt-2">
              <ul className="w-full border border-gray-300 rounded-lg divide-y">
                <li className="flex bg-gray-200 font-semibold">
                  <span className="w-1/3 p-3">Feature</span>
                  <span className="w-1/3 p-3 text-center">GPT-4o-mini</span>
                  <span className="w-1/3 p-3 text-center">Gemini 1.5 Pro</span>
                </li>
                <li className="flex">
                  <span className="w-1/3 p-3">Strength</span>
                  <span className="w-1/3 p-3 text-center">
                    Strong reasoning and summarization ability
                  </span>
                  <span className="w-1/3 p-3 text-center">
                    Context-aware and efficient with multimodal inputs
                  </span>
                </li>
                <li className="flex">
                  <span className="w-1/3 p-3">Speed</span>
                  <span className="w-1/3 p-3 text-center">Verry good</span>
                  <span className="w-1/3 p-3 text-center">Good</span>
                </li>
                <li className="flex bg-gray-100">
                  <span className="w-1/3 p-3">Output</span>
                  <span className="w-1/3 p-3 text-center">
                    Detailed, technical, and precise
                  </span>
                  <span className="w-1/3 p-3 text-center">
                    More conversational
                  </span>
                </li>
                <li className="flex">
                  <span className="w-1/3 p-3">Best Use Case</span>
                  <span className="w-1/3 p-3 text-center">
                    Technical reports, scientific summaries
                  </span>
                  <span className="w-1/3 p-3 text-center">
                    General-purpose summaries, creative answer
                  </span>
                </li>
                <li className="flex bg-gray-100">
                  <span className="w-1/3 p-3">API access</span>
                  <span className="w-1/3 p-3 text-center">
                    Yes (restricted)
                  </span>
                  <span className="w-1/3 p-3 text-center">Yes</span>
                </li>
              </ul>
              <p className="text-gray-700">
                Note: contact developer for access to gpt-4o-mini model
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Understanding the LLM&apos;s Prompts
          </h2>
          <p className="text-gray-700 mb-4">
            When we ask the LLM to help with cell annotation, we provide it with
            specific instructions:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-gray-800 mb-2">The Main Prompt</h4>
            <p className="text-gray-700 italic">
              For every cluster, annotate the cells by considering cell type
              variation and the highest score values, with additional insights
              from summaries and input data. Use external references where
              relevant, and explain any data discrepancies.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            What This Means?
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
            <li>
              <strong>Consider cell type variation</strong>: Look at the
              diversity of cell types that scored highly
            </li>
            <li>
              <strong>Focus on highest score values</strong>: Prioritize cell
              types with the best statistical evidence
            </li>
            <li>
              <strong>Use additional insights</strong>: Consider gene function
              information and biological context
            </li>
            <li>
              <strong>Explain discrepancies</strong>: Address any conflicting
              evidence or unusual patterns
            </li>
          </ul>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-blue-800 mb-2">
              Guidelines for the LLM
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                Ensure the three cell annotations are biologically related (not
                random unrelated cells)
              </li>
              <li>
                Only recommend cell types that correspond to the selected tissue
              </li>
              <li>Provide clear documentation explaining the reasoning</li>
              <li>Include scientific references to support the annotations</li>
            </ul>
          </div>

          <p className="text-gray-700">
            This approach combines statistical evidence (scores) with biological
            knowledge (LLM analysis) to provide the most accurate and
            scientifically sound cell annotations possible.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Region Analysis with Tavily
          </h2>
          <p className="text-gray-700 mb-4">
            Our system uses Tavily, a specialized AI-powered search engine, to
            analyze the relationship between genes, cell types, and biological
            regions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-teal-50 p-4 rounded-lg">
              <h4 className="font-bold text-teal-800 mb-2">What is Tavily?</h4>
              <p className="text-gray-700">
                Tavily is an AI search engine that specializes in finding and
                synthesizing scientific information. Unlike general search
                engines, Tavily is designed to understand complex scientific
                queries and provide accurate, research-backed answers.
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <h4 className="font-bold text-amber-800 mb-2">How We Use It</h4>
              <p className="text-gray-700">
                When you select a region (tumor, stromal/immune, or normal
                compartment), we use Tavily to search for scientific evidence
                about how your genes and region relate to that
                specific biological context.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            The Region Analysis Process
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
            <li>
              <strong>You select a biological region</strong> (tumor,
              stromal/immune, or normal compartment)
            </li>
            <li>
              <strong>We formulate a scientific query</strong> combining your
              genes and the selected region
            </li>
            <li>
              <strong>Tavily searches scientific literature</strong> for
              relevant information
            </li>
            <li>
              <strong>The results are synthesized</strong> into a comprehensive
              analysis
            </li>
            <li>
              <strong>You receive insights</strong> about how your genes and
              cell types function in the selected region
            </li>
          </ol>

          <div className="bg-orange-50 p-4 rounded-lg mb-6">
            <h4 className="font-bold text-orange-800 mb-2">
              Why Region Analysis Matters
            </h4>
            <p className="text-gray-700 mb-2">
              Cells behave differently depending on their environment. For
              example:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>
                A T-cell in a tumor environment might be exhausted or suppressed
              </li>
              <li>
                The same T-cell in normal tissue might be in a surveillance
                state
              </li>
              <li>
                In an inflammatory environment, it might be highly activated
              </li>
            </ul>
            <p className="text-gray-700 mt-2">
              Understanding these contextual differences is crucial for accurate
              cell annotation and biological interpretation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documentation;

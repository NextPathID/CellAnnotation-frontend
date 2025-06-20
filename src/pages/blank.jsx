// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { Send, Plus, Minus } from "lucide-react";
import uberonTerms from "../data/uberon_terms.json";
import geneTerms from "../data/gene_to_ensembl.json";
import { useLLM } from "../context/LLMContext";
import ModelSelector from "../components/ModelSelector";
import ScoreParameters from "../components/ScoreParameters";

function BlankPage() {
  const BASE_API = "http://api-cellannotations.menkrepp.my.id";
  const [formData, setFormData] = useState({
    tissue: "",
    genes: [""],
  });
  const [annotations, setAnnotations] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const { selectedModel } = useLLM();
  const [isProcessing, setIsProcessing] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [analyzingRelationship, setAnalyzingRelationship] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [cellRegions, setCellRegions] = useState({});
  const [selectedRegion, setSelectedRegion] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [regionErrors, setRegionErrors] = useState({});

  const [scoreParams, setScoreParams] = useState({
    alpha: 2.5,
    beta: 0.5,
    gamma: 1.0,
  });

  const regionOptions = [
    { value: "tumor region", label: "Tumor Region" },
    { value: "stromal or immune", label: "Stromal or Immune" },
    { value: "normal compartment", label: "Normal Compartment" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "tissue") {
      setFormData((prev) => ({ ...prev, tissue: value }));
    }
  };

  const handleGeneChange = (index, value) => {
    setFormData((prev) => {
      const newGenes = [...prev.genes];
      newGenes[index] = value;
      return { ...prev, genes: newGenes };
    });
  };

  const addGeneInput = () => {
    setFormData((prev) => ({
      ...prev,
      genes: [...prev.genes, ""],
    }));
  };

  const removeGeneInput = (index) => {
    setFormData((prev) => {
      const newGenes = prev.genes.filter((_, i) => i !== index);
      return { ...prev, genes: newGenes.length ? newGenes : [""] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);
    setAnnotations([]);
    setCellRegions({});
    setRegionErrors({});

    try {
      const genes = formData.genes.filter((gene) => gene.trim());

      if (genes.length === 0) {
        throw new Error("Please enter at least one gene name");
      }

      const response = await axios.post(
        `${BASE_API}/process-direct-annotation/`,
        {
          genes: genes,
          tissue: formData.tissue,
          model: selectedModel,
          score_params: scoreParams,
        }
      );
      console.log("Response:", response);

      const annotationsData = response.data.annotations?.annotations || [];
      setAnnotations(annotationsData);
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "An error occurred while processing the annotation"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeRelationship = async (index) => {
    if (analyzingRelationship[index]) return;

    setIsProcessing(true);
    setAnalyzingRelationship((prev) => ({ ...prev, [index]: true }));

    try {
      const genes = formData.genes.filter((gene) => gene.trim());
      const annotation = annotations[index];
      const response = await axios.post(
        `${BASE_API}/analyze-region-relationship/`,
        {
          cell1: annotation.cell_annotation_1,
          cell2: annotation.cell_annotation_2,
          cell3: annotation.cell_annotation_3,
          cell_regions: selectedRegion, // Hanya satu region yang dikirim
          genes: genes,
        }
      );
      console.log("Response:", response.data);

      const updatedAnnotations = [...annotations];
      updatedAnnotations[index] = {
        ...annotation,
        relationship_analysis: response.data.analysis,
      };
      setAnnotations(updatedAnnotations);
    } catch (error) {
      console.error("Error analyzing relationship:", error);
    } finally {
      setIsProcessing(false);
      setAnalyzingRelationship((prev) => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Gene to Annotation
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center"></div>
              <ScoreParameters
                scoreParams={scoreParams}
                onScoreParamsChange={setScoreParams}
              />
              <div className="flex flex-row justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Gene Names
                </h3>
                <ModelSelector />
                <div className="flex gap-2">
                  <select
                    id="tissue"
                    name="tissue"
                    value={formData.tissue}
                    onChange={handleInputChange}
                    className="w-52 p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a tissue</option>
                    {uberonTerms
                      .sort((a, b) =>
                        Object.values(a)[0].localeCompare(Object.values(b)[0])
                      )
                      .map((term, index) => {
                        const [id, name] = Object.entries(term)[0];
                        return (
                          <option key={index} value={id}>
                            {name}
                          </option>
                        );
                      })}
                  </select>
                  <button
                    type="button"
                    onClick={addGeneInput}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Gene
                  </button>
                </div>
              </div>
              {formData.genes.map((gene, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={gene}
                    onChange={(e) => handleGeneChange(index, e.target.value)}
                    list={`geneList${index}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter gene name"
                  />
                  <datalist id={`geneList${index}`}>
                    {Object.keys(geneTerms).map((gene, i) => (
                      <option key={i} value={gene} />
                    ))}
                  </datalist>
                  {formData.genes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGeneInput(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Minus className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-5 h-5 mr-2" />{" "}
              {isProcessing ? "Processing..." : "Process Annotation"}
            </button>
          </form>
        </div>

        {annotations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Annotation Results
            </h2>
            {annotations.map((annotation, index) => (
              <div key={index} className="mb-4 p-4 border rounded-md">
                <div className="mb-4">
                  <h2 className="font-medium text-gray-700 mb-2">
                    Anotated Cell:
                  </h2>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Cell Annotation 1: {annotation.cell_annotation_1}</li>
                    <li>Cell Annotation 2: {annotation.cell_annotation_2}</li>
                    <li>Cell Annotation 3: {annotation.cell_annotation_3}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Analysis:</h4>
                  <p className="text-gray-700">
                    {[annotation.Documentation]
                      .filter(Boolean) // Supaya tidak ada yang kosong
                      .join(", ")}
                  </p>
                  <h4 className="font-medium text-gray-700 my-2 mb-1">
                    Region Analysis:
                  </h4>
                  <p className="text-gray-800 underline mb-2">
                    This process evaluates whether specific cells and genes, at
                    the region regions align biologically based on known
                    scientific data and references.
                  </p>
                  {!annotation.analysis_done && (
                    <div className="space-y-2">
                      <h4 className="text-gray-800 mb-2">Choose region:</h4>
                      <div className="flex space-x-2">
                        {regionOptions.map((option) => (
                          <label
                            key={option.value}
                            className={`flex items-center cursor-pointer border rounded-lg px-3 py-2 transition ${
                              selectedRegion === option.value
                                ? "bg-blue-500 text-white border-blue-600"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            {option.label}
                            <input
                              type="radio"
                              name="region"
                              value={option.value}
                              checked={selectedRegion === option.value}
                              onChange={(e) =>
                                setSelectedRegion(e.target.value)
                              }
                              className="hidden"
                            />
                          </label>
                        ))}
                      </div>
                      <button
                        disabled={isProcessing || !selectedRegion} // Disabled jika tidak ada region yang dipilih
                        onClick={() => analyzeRelationship(index)}
                        className={`flex px-2 py-1 bg-green-600 text-white cursor-pointer rounded hover:bg-blue-700 transition-colors flex items-center ${
                          isProcessing || !selectedRegion
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isProcessing ? "Analyzing..." : "Find Analysis"}
                      </button>
                    </div>
                  )}
                  {annotation.relationship_analysis && (
                    <p className="text-gray-700 mb-2">
                      {annotation.relationship_analysis}
                    </p>
                  )}
                  <p className="text-gray-700">
                    References:&nbsp;
                    {[annotation.References]
                      .filter(Boolean) // Supaya tidak ada yang kosong
                      .join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BlankPage;

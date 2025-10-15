import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook/hook";
import { fetchAllSkills } from "../../store/slices/SkillSlice";
import { createQuestion } from "../../store/slices/QuestionSlice";
import { toast } from "react-toastify";

const CreateQuestion = () => {
    const dispatch = useAppDispatch();
    const { allSkills } = useAppSelector((state) => state.skill);

    const [selectedSkill, setSelectedSkill] = useState<number | "">("");
    const [skillIds, setSkillIds] = useState<number[]>([]);
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState<string[]>(["", ""]);
    const [correctOptionIndex, setCorrectOptionIndex] = useState<number | "">("");

    useEffect(() => {
        dispatch(fetchAllSkills());
    }, [dispatch]);

    const handleAddSkill = () => {
        if (selectedSkill === "") {
            toast.warn("Please select a skill first");
            return;
        }

        if (skillIds.includes(Number(selectedSkill))) {
            toast.info("Skill already added");
            return;
        }

        setSkillIds([...skillIds, Number(selectedSkill)]);
        setSelectedSkill("");
    };

    // ✅ Remove skill tag
    const handleRemoveSkill = (id: number) => {
        setSkillIds(skillIds.filter((skillId) => skillId !== id));
    };

    const handleOptionChange = (index: number, value: string) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const addOption = () => {
        if (options.length >= 6) {
            toast.warn("Maximum 6 options allowed");
            return;
        }
        setOptions([...options, ""]);
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) {
            toast.warn("At least 2 options required");
            return;
        }
        setOptions(options.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (skillIds.length === 0 || !questionText.trim()) {
            toast.warn("Please add at least one skill and enter a question");
            return;
        }
        if (options.some((opt) => !opt.trim())) {
            toast.warn("All options must have text");
            return;
        }
        if (correctOptionIndex === "" || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
            toast.warn("Select a valid correct answer");
            return;
        }

        const payload = {
            skillIds,
            questionText,
            options,
            correctOptionIndex: Number(correctOptionIndex),
        };

        try {
            await dispatch(createQuestion(payload) as any).unwrap();
            toast.success("Question created successfully!");
            setQuestionText("");
            setOptions(["", ""]);
            setCorrectOptionIndex("");
            setSkillIds([]);
        } catch (err: any) {
            console.error("Error creating question:", err);
            toast.error(err?.message || "Something went wrong");
        }

    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4">Create Question</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* ✅ Skill Add Section */}
                <div>
                    <label className="block font-medium mb-1">Select Skill</label>
                    <div className="flex gap-2">
                        <select
                            className="w-full border p-2 rounded"
                            value={selectedSkill}
                            onChange={(e) => setSelectedSkill(e.target.value ? Number(e.target.value) : "")}
                        >
                            <option value="">-- Select Skill --</option>
                            {allSkills?.map((skill: any) => (
                                <option key={skill.id} value={skill.id}>
                                    {skill.name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleAddSkill}
                            className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>

                    {/* ✅ Added Skills as tags */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {skillIds.map((id) => {
                            const skill = allSkills?.find((s: any) => s.id === id);
                            return (
                                <span
                                    key={id}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                                >
                                    {skill?.name || "Unknown"}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(id)}
                                        className="text-red-500 font-bold"
                                    >
                                        ✕
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Question Text */}
                <div>
                    <label className="block font-medium mb-1">Question</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        rows={3}
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Enter the question text"
                    />
                </div>

                {/* Options */}
                <div>
                    <label className="block font-medium mb-2">Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="flex-grow border p-2 rounded"
                            />
                            <input
                                type="radio"
                                name="correctOption"
                                checked={correctOptionIndex === index}
                                onChange={() => setCorrectOptionIndex(index)}
                            />
                            <label className="text-sm text-gray-600">Correct</label>
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="text-red-500 hover:text-red-700 font-semibold"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addOption}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        + Add Option
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold"
                >
                    Create Question
                </button>
            </form>
        </div>
    );
};

export default CreateQuestion;

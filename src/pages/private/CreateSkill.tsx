import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook/hook";
import { createSkill, fetchAllSkills } from "../../store/slices/SkillSlice";
import { toast } from "react-toastify";

const CreateSkill = () => {
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();
  const { loading, allSkills } = useAppSelector((state) => state.skill);

  // Fetch skills on mount
  useEffect(() => {
    dispatch(fetchAllSkills());
  }, [dispatch]);

  // Handle create skill
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warn("Please enter a skill name");
      return;
    }

    try {
      const resultAction = await dispatch(createSkill({ name }));

      if (createSkill.fulfilled.match(resultAction)) {
        toast.success("✅ Skill created successfully!");
        setName("");
        dispatch(fetchAllSkills());
      } else {
        const errorMessage =
          (resultAction.payload as any)?.message || "Failed to create skill";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Create New Skill
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skill Name
          </label>
          <input
            type="text"
            placeholder="Enter skill name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Skill"}
        </button>
      </form>

      {/* Skills List */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          All Skills
        </h3>

        {loading ? (
          <p className="text-gray-500 text-center">Loading skills...</p>
        ) : Array.isArray(allSkills) && allSkills.length > 0 ? (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {allSkills.map((skill: any) => (
              <li
                key={skill.id}
                className="border rounded-lg p-2 text-gray-700 flex justify-between items-center"
              >
                <span>{skill.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No skills found</p>
        )}
      </div>
    </div>
  );
};

export default CreateSkill;

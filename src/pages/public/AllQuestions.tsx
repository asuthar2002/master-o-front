import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook/hook";
import { fetchAllQuestions } from "../../store/slices/QuestionSlice";

const AllQuestions = () => {
    const dispatch = useAppDispatch();
    const { allQuestions, totalPages, loading } = useAppSelector((state) => state.question);
    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchAllQuestions({ page, limit: 10 })); // fetch 10 questions per page
    }, [dispatch, page]);

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">📋 All Questions</h2>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : allQuestions.length === 0 ? (
                <div className="text-center text-gray-600 py-10">No questions found.</div>
            ) : (
                <div className="space-y-6">
                    {allQuestions.map((q: any, index: number) => (
                        <div
                            key={q.id}
                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                        >
                            {/* Question Header */}
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-500 font-medium">
                                    #{index + 1 + (page - 1) * 10}
                                </span>

                                {/* Skills */}
                                <div className="flex gap-2 text-xs text-gray-500">
                                    {q.skills?.map((s: any) => (
                                        <span
                                            key={s.id}
                                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md"
                                        >
                                            {s.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Question Text */}
                            <p className="text-lg font-semibold text-gray-800">{q.questionText}</p>
                        </div>
                    ))}

                    {/* Pagination */}
                    <div className="flex justify-between items-center mt-8">
                        <button
                            onClick={handlePrev}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded ${page === 1
                                    ? "bg-gray-200 text-gray-400"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            Prev
                        </button>

                        <span className="text-gray-700 font-medium">
                            Page {page} of {totalPages}
                        </span>

                        <button
                            onClick={handleNext}
                            disabled={page === totalPages}
                            className={`px-4 py-2 rounded ${page === totalPages
                                    ? "bg-gray-200 text-gray-400"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllQuestions;

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook/hook";
import { fetchAllQuestions } from "../../store/slices/QuestionSlice";
import apiInstance from "../../api/apiInstance";
import { endpoints } from "../../api/endpoint";
import { toast } from "react-toastify";

const ShowQuestions = () => {
    const dispatch = useAppDispatch();
    const { allQuestions, totalPages, loading } = useAppSelector((state) => state.question);
    const { user } = useAppSelector((state) => state.auth);
    const [page, setPage] = useState(1);

    const [userAnswers, setUserAnswers] = useState<{ [key: number]: number | null }>({});
    const [submitted, setSubmitted] = useState<{ [key: number]: boolean }>({});
    const [checkResults, setCheckResults] = useState<{ [key: number]: boolean | null }>({});

    useEffect(() => {
        dispatch(fetchAllQuestions({ page, limit: 1 }));
    }, [dispatch, page]);

    const handleOptionSelect = (questionId: number, optionIndex: number) => {
        if (submitted[questionId]) return;
        setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    };

    const handleSubmitAnswer = async (questionId: number) => {
        if (!user) {
            toast.error("Please Login First");
            return;
        }
        const selectedIndex = userAnswers[questionId];
        if (selectedIndex == null) {
            toast.warn("Please select an answer first.");
            return;
        }

        try {
            const res = await apiInstance.post(endpoints.question.checkQuestionAnswer, {
                userId: user?.id,
                questionId,
                selectedOptionIndex: selectedIndex,
            });
            const isCorrect = res.data?.data?.isCorrect ?? false;

            setCheckResults((prev) => ({ ...prev, [questionId]: isCorrect }));
            setSubmitted((prev) => ({ ...prev, [questionId]: true }));

            if (isCorrect) toast.success("Correct answer!");
            else toast.error("Wrong answer.");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to check answer");
        }
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
        setUserAnswers({});
        setSubmitted({});
        setCheckResults({});
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
        setUserAnswers({});
        setSubmitted({});
        setCheckResults({});
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">🧠 Practice Questions</h2>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : allQuestions.length === 0 ? (
                <div className="text-center text-gray-600 py-10">No questions found.</div>
            ) : (
                <div className="space-y-8">
                    {allQuestions.map((q: any, index: number) => {
                        const userSelected = userAnswers[q.id];
                        const isSubmitted = submitted[q.id];
                        const isCorrect = checkResults[q.id];

                        return (
                            <div
                                key={q.id}
                                className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-500">
                                        Q{index + 1 + (page - 1) * 3}
                                    </span>
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
                                <h3 className="font-semibold text-lg mb-4">{q.questionText}</h3>
                                <div className="space-y-2">
                                    {q.options.map((opt: string, i: number) => {
                                        const selected = userSelected === i;
                                        const correct = isSubmitted && isCorrect && i === userSelected;
                                        const wrong = isSubmitted && !isCorrect && i === userSelected;

                                        let optionStyle = "border-gray-300 hover:bg-blue-50";
                                        if (correct) optionStyle = "border-green-500 bg-green-100";
                                        else if (wrong) optionStyle = "border-red-500 bg-red-100";
                                        else if (selected && !isSubmitted)
                                            optionStyle = "border-blue-500 bg-blue-100";

                                        return (
                                            <div
                                                key={i}
                                                onClick={() => handleOptionSelect(q.id, i)}
                                                className={`border p-2 rounded-md cursor-pointer transition ${optionStyle}`}
                                            >
                                                {opt}
                                            </div>
                                        );
                                    })}
                                </div>

                                {!isSubmitted ? (
                                    <button
                                        disabled={userSelected == null}
                                        onClick={() => handleSubmitAnswer(q.id)}
                                        className={`mt-4 px-4 py-2 rounded-md text-white font-semibold ${userSelected == null
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700"
                                            }`}
                                    >
                                        Submit Answer
                                    </button>
                                ) : (
                                    <div className="mt-4 font-medium">
                                        {isCorrect ? (
                                            <span className="text-green-600"> Correct Answer!</span>
                                        ) : (
                                            <span className="text-red-600">Wrong Answer.</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

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
                        <span className="text-gray-700">
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

export default ShowQuestions;

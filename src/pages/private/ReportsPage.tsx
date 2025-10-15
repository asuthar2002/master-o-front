import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hook/hook";
import { fetchUserPerformance, fetchSkillGap, fetchTimeReport, setFilterType, selectReports, } from "../../store/slices/ReportsSlice";
import { toast } from "react-toastify";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LineChart, Line, Legend, } from "recharts";

const ReportsPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { userPerformance, skillGaps, timeReport, filterType, loading, error, } = useAppSelector(selectReports);

    useEffect(() => {
        const fetchAllReports = async () => {
            try {
                await Promise.all([
                    dispatch(fetchUserPerformance()).unwrap(),
                    dispatch(fetchSkillGap()).unwrap(),
                    dispatch(fetchTimeReport(filterType)).unwrap(),
                ]);
            } catch (err: any) {
                toast.error("Failed to load reports");
                console.error("Report fetch error:", err)
            }
        };

        fetchAllReports();
    }, [dispatch, filterType]);

    if (loading)
        return <p className="text-center mt-10 text-lg">Loading reports...</p>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-10">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Performance Reports</h1>

            <div className="flex items-center justify-end gap-3 mb-6">
                <label htmlFor="filter" className="text-gray-600 font-medium">
                    Filter by:
                </label>
                <select
                    id="filter"
                    value={filterType}
                    onChange={(e) =>
                        dispatch(setFilterType(e.target.value as "week" | "month"))
                    }
                    className="border rounded-md px-3 py-1 bg-white"
                >
                    <option value="week">Weekly</option>
                    <option value="month">Monthly</option>
                </select>
            </div>

            <section>
                <h2 className="text-xl font-semibold mb-3 text-blue-700">
                    User-wise Performance
                </h2>

                <div className="w-full h-80 mb-6">
                    <ResponsiveContainer>
                        <BarChart
                            data={userPerformance}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fullName" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="averageScore" fill="#4F46E5" name="Average Score (%)" />
                            <Bar dataKey="totalAttempts" fill="#10B981" name="Attempts" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">User</th>
                                <th className="p-2">Attempts</th>
                                <th className="p-2">Questions</th>
                                <th className="p-2">Correct</th>
                                <th className="p-2">Average Score (%)</th>
                                <th className="p-2">Last Attempt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userPerformance.map((u) => (
                                <tr key={u.id} className="border-t text-center">
                                    <td className="p-2 text-left">{u.fullName}</td>
                                    <td className="p-2">{u.totalAttempts}</td>
                                    <td className="p-2">{u.totalQuestions}</td>
                                    <td className="p-2">{u.totalCorrect}</td>
                                    <td
                                        className={`p-2 font-semibold ${(u.averageScore ?? 0) >= 70 ? "text-green-700" : "text-red-600"}`}
                                    >
                                        {u.averageScore != null ? Number(u.averageScore).toFixed(1) : "0.0"}%
                                    </td>


                                    <td className="p-2 text-gray-500">
                                        {u.lastAttempt
                                            ? new Date(u.lastAttempt).toLocaleDateString()
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                            {userPerformance.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center p-3 text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-3 text-blue-700">
                    Skill Gap Report
                </h2>

                {/* Chart */}
                <div className="w-full h-80 mb-6">
                    <ResponsiveContainer>
                        <BarChart
                            data={skillGaps}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="accuracy" fill="#EF4444" name="Accuracy (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">Skill</th>
                                <th className="p-2">Total Attempts</th>
                                <th className="p-2">Correct Answers</th>
                                <th className="p-2">Accuracy (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {skillGaps.map((s) => (
                                <tr key={s.id} className="border-t text-center">
                                    <td className="p-2 text-left">{s.name}</td>
                                    <td className="p-2">{s.totalAttempts}</td>
                                    <td className="p-2">{s.correctAnswers}</td>
                                    <td
                                        className={`p-2 font-semibold ${(s.accuracy ?? 0) >= 70 ? "text-green-700" : "text-red-600"
                                            }`}
                                    >
                                        {s.accuracy != null ? Number(s.accuracy).toFixed(1) : "0.0"}%
                                    </td>

                                </tr>
                            ))}
                            {skillGaps.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center p-3 text-gray-500">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-3 text-blue-700">
                    {filterType === "week" ? "Weekly" : "Monthly"} Performance Trend
                </h2>

                <div className="w-full h-80 mb-6">
                    <ResponsiveContainer>
                        <LineChart
                            data={timeReport}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" name="Avg Score (%)" />
                            <Line type="monotone" dataKey="attempts" stroke="#10B981" name="Attempts" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {error && (
                <p className="text-center text-red-600 mt-4">
                    ⚠️ {error.message || "An error occurred while loading reports"}
                </p>
            )}
        </div>
    );
};

export default ReportsPage;

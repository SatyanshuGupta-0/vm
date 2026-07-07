import React, { useState, useEffect } from "react";
import { fetchDataFromApi, postData } from "../../utils/api";

const RefundEligibility = ({ orderId }) => {
    const [eligible, setEligible] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refundMessage, setRefundMessage] = useState("");
    const [refundTill, setRefundTill] = useState("");
    const [daysExpired, setDaysExpired] = useState(null);

    const handleRefundRequest = async () => {
        try {
            const res = await postData(`/api/order/refund-request/${orderId}`);
            alert(res.message);
            setEligible(false); // disable the button
            setRefundMessage("Refund requested");
        } catch (err) {
            alert(err.response?.data?.message || "Refund failed");
        }
    };


    useEffect(() => {
        const checkEligibility = async () => {
            try {
                setLoading(true);
                const res = await fetchDataFromApi(`/api/order/refund-eligibility/${orderId}`);
                setEligible(res.eligible);
                setRefundMessage(res.message);

                const validTillDate = new Date(res.refundValidTill);
                setRefundTill(validTillDate.toLocaleDateString());

                if (!res.eligible) {
                    const today = new Date();
                    const diff = Math.floor((today - validTillDate) / (1000 * 60 * 60 * 24));
                    setDaysExpired(diff);
                }
            } catch (err) {
                setRefundMessage("Unable to check refund eligibility.");
                setEligible(false);
            } finally {
                setLoading(false);
            }
        };

        checkEligibility();
    }, [orderId]);

    if (loading) return <p className="mt-4 text-gray-500">Checking refund eligibility...</p>;

    return (
        <div className="mt-6 border rounded-lg p-6 shadow bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Refund Eligibility</h3>

            <p className={`mb-2 ${eligible ? "text-green-700" : "text-red-600"}`}>
                {refundMessage}
            </p>

            {eligible ? (
                <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-600">Valid until: {refundTill}</p>
                    {/* <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded shadow"
            onClick={() => alert("Refund request initiated. (Hook this up later)")}
          >
            Request Refund
          </button> */}
                    <button
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded shadow"
                        onClick={handleRefundRequest}
                    >
                        Request Refund
                    </button>

                </div>
            ) : (
                <p className="text-sm text-gray-500 mt-2">
                    Refund expired {daysExpired} {daysExpired === 1 ? "day" : "days"} ago on {refundTill}.
                </p>
            )}
        </div>
    );
};

export default RefundEligibility;

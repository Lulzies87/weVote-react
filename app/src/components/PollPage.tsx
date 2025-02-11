import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { server } from "../services/axiosInstance";
import { Poll } from "../types/poll";

export function PollPage() {
    const { id } = useParams();
    const [poll, setPoll] = useState<Poll | null>(null);

    useEffect(() => {
        async function fetchPoll() {
            try {
                const res = await server.get(`/poll/${id}`);
                setPoll(res.data);
            } catch (error) {
                console.error("Failed to fetch poll data:", error);
            }
        }

        if (id) fetchPoll();
    }, [id]);


    { if (!poll) return (<><h1>Poll wasn't found</h1></>) }

    return (
        <>
            <h1>{poll.title}</h1>
            <div className="max-w-[800px] flex flex-col gap-8">
                <div className="flex justify-between">
                    <p>Cost: {poll.cost}</p>
                    <p>Votes: {poll.votes} / 80</p>
                    <p>Deadline: {new Date(poll.deadline).toLocaleDateString("en-GB")}</p>
                </div>
                <p>{poll.details}</p>
                <div className="flex justify-around">
                    <button className="py-1 px-4 rounded destructive">Back</button>
                    <button className="py-1 px-4 rounded">Vote</button>
                </div>
            </div>
        </>
    )
}
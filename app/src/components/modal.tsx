import { ChangeEvent, useState } from "react"
import { server } from "../services/axiosInstance";
import { Poll } from "../types/poll";

interface ModalProps {
    isVisible: boolean;
    onClose: () => void;
}

export function Modal({ isVisible, onClose }: ModalProps) {
    const aWeekFromToday = new Date();
    aWeekFromToday.setDate(aWeekFromToday.getDate() + 7);
    const deadline = aWeekFromToday.toISOString().split("T")[0];

    const [newPoll, setNewPoll] = useState<Poll>({ title: "", deadline: deadline, cost: 0, details: "" });

    const onCancel = () => {
        setNewPoll({ title: "", deadline: deadline, cost: 0, details: "" });
        onClose();
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPoll((prevPoll) => ({ ...prevPoll, [name]: value, }));
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await server.post("/polls", newPoll);
            console.log("Poll created successfully!", newPoll);
            onCancel();
        } catch (error) {
            console.error("Failed to submit form", error);
        }
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center bg-black/50 ${isVisible ? "" : "hidden"}`}>
            <div className="bg-neutral-800 p-6 rounded min-w-[min(60vw,600px)] text-center">
                <h2>Create a new Poll</h2>
                <form className="flex flex-col items-center gap-4 pt-2" onSubmit={onSubmit}>
                    <input name="title" onChange={handleChange} className="w-full placeholder-gray-400 placeholder-opacity-50 text-black bg-white p-1 rounded" value={newPoll.title} type="text" placeholder="Poll Title" />
                    <input name="deadline" onChange={handleChange} className="w-full placeholder-gray-400 placeholder-opacity-50 text-black bg-white p-1 rounded" value={newPoll.deadline} type="date" placeholder="Deadline" />
                    <input name="cost" onChange={handleChange} className="w-full placeholder-gray-400 placeholder-opacity-50 text-black bg-white p-1 rounded" value={newPoll.cost} type="text" placeholder="Cost" />
                    <input name="details" onChange={handleChange} className="w-full placeholder-gray-400 placeholder-opacity-50 text-black bg-white p-1 rounded" value={newPoll.details} type="text" placeholder="Details" />

                    <div className="w-full flex justify-between">
                        <button className="w-max py-1 px-4 rounded" type="submit">Create Poll</button>
                        <button className="w-max py-1 px-4 rounded destructive" onClick={onCancel} type="button">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
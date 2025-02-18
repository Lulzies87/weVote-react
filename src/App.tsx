import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { server } from "./services/axiosInstance";
import { Poll } from "./types/poll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { NewPollForm } from "./components/NewPollForm";
import { useTenant } from "./context/TenantContext";

function App() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [totalApartments, setTotalApartments] = useState(0);
  const { tenant } = useTenant();

  useEffect(() => {
    async function getPolls() {
      try {
        const res = await server.get("/polls");
        const arrangedPolls = arrangeByStatus(res.data.polls);
        setPolls(arrangedPolls);
        setTotalApartments(res.data.totalApartments);
      } catch (error) {
        console.error("Failed to fetch polls", error);
      }
    }

    getPolls();
  }, []);

  function arrangeByStatus(polls: Poll[]) {
    const statusTypes = ["Open", "Voted", "Closed", "Cancelled"];

    return statusTypes
      .map((status) => polls.filter((poll) => poll.status === status))
      .flat();
  }

  return (
    <>
      <h1 className="m-4 text-center">Welcome, {tenant?.fName}</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Poll Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Votes</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead className="text-right">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={"outline"} size={"tiny"}>
                    +
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Poll</DialogTitle>
                    <DialogDescription>
                      Please insert all poll details:
                    </DialogDescription>
                  </DialogHeader>

                  <NewPollForm></NewPollForm>
                </DialogContent>
              </Dialog>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {polls.map((poll) => (
            <TableRow key={poll.id}>
              <TableCell className="font-medium">
                <Link to={`/polls/${poll.id}`}>{poll.title}</Link>
              </TableCell>
              <TableCell
                className={`
                ${poll.status === "Open" ? "bg-green-100" : ""}
                ${poll.status === "Voted" ? "bg-yellow-100" : ""}
                ${poll.status === "Closed" ? "bg-gray-200" : ""}
                ${poll.status === "Cancelled" ? "bg-red-100" : ""}
                `}
              >
                {poll.status}
              </TableCell>
              <TableCell>{poll.cost == 0 ? "No Cost" : poll.cost}</TableCell>
              <TableCell>
                {poll.votes} / {totalApartments}
              </TableCell>
              <TableCell>
                {new Date(poll.deadline).toLocaleDateString("en-GB")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default App;

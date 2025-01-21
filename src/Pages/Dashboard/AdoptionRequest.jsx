import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useContext } from "react";
import AuthContext from "../../context/authContext";
import Swal from "sweetalert2";

const AdoptionRequest = () => {
  const axiosSecurePublic = useAxiosPublic();
  const { user } = useContext(AuthContext);

  const { data: adoptionRequests = [], refetch } = useQuery({
    queryKey: ["adoptions", user.email],
    queryFn: async () => {
      const res = await axiosSecurePublic.get(`/adoptions/${user?.email}`);
      return res.data;
    },
  });

  const handleAccept = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will mark the adoption request as accepted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    });

    if (confirm.isConfirmed) {
      await axiosSecurePublic.patch(`/adoptions/${id}`, { status: "accepted" });
      Swal.fire("Accepted!", "The adoption request has been accepted.", "success");
      refetch(); // Refetch the updated data
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will reject the adoption request permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    });

    if (confirm.isConfirmed) {
      await axiosSecurePublic.delete(`/adoptions/${id}`);
      Swal.fire("Rejected!", "The adoption request has been rejected.", "error");
      refetch(); // Refetch the updated data
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Adoption Requests</h1>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="p-3">Pet Name</th>
              <th className="p-3">Requester Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adoptionRequests.length > 0 ? (
              adoptionRequests.map((request) => (
                <tr key={request._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{request.petName}</td>
                  <td className="p-3">{request.userName}</td>
                  <td className="p-3">{request.userEmail}</td>
                  <td className="p-3">{request.phone}</td>
                  <td className="p-3">{request.address}</td>
                  <td className="p-3 flex justify-center gap-4">
                    <button
                    disabled={request?.status}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleAccept(request._id)}
                    >
                    {(request?.status)?'Accepted':'Accept'}
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleReject(request._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-600">
                  No adoption requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdoptionRequest;

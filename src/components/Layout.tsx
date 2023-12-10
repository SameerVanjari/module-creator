import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
// import { getModules } from "@/services/api.service";

interface Props {
  children: JSX.Element;
}

const Layout = ({ children }: Props) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;
  const queryClient = useQueryClient();
  const moduleQ = useQuery({
    queryKey: ["modules-name-list"],
    queryFn: async () => {
      const response = await fetch(`${BACKEND_URL}/api/v1/modules`);
      const res = await response.json();

      return res;
    },
  });
  const modules = moduleQ.isSuccess ? moduleQ.data.data : {};

  const handleClick = async (id) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/modules/${id}`, {
        method: "DELETE",
      });
      const res = await response.json();

      toast.success("Module Deleted");
      queryClient.invalidateQueries({ queryKey: ["modules-name-list"] });

      return res;
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <div className="flex">
      <div className="h-screen sticky top-0 w-[20vw] bg-blue-custom shadow-sm p-6">
        <h1 className="text-lg font-bold text-slate-50">Dashboard</h1>

        <ul className="pt-5 space-y-3 text-sm">
          <a href="/" className="w-full">
            <li className="text-white hover:bg-blue-600 p-2">Create module</li>
          </a>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none text-white">
              <AccordionTrigger className="">Modules</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 px-3">
                  {moduleQ.isSuccess &&
                    modules.map((item: any) => (
                      <li className="hover:bg-blue-600 p-2 flex justify-between">
                        <a href={`/modules/${item._id}`} className="w-full">
                          <p>{item.name}</p>{" "}
                        </a>
                        <div className="flex space-x-2 ">
                          <a href={`/modules/edit/${item._id}`}>
                            <Edit2 size={16} className="cursor-pointer" />
                          </a>
                          <Trash2
                            onClick={() => handleClick(item._id)}
                            size={16}
                            className="text-red-500 cursor-pointer"
                          />
                        </div>
                      </li>
                    ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ul>
      </div>

      <div className="flex-1 bg-slate-100 min-h-screen">{children}</div>
    </div>
  );
};

export default Layout;

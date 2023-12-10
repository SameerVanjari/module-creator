import CheckBox from "@/components/CheckBox";
import Radio from "@/components/Radio";
import SelectField from "@/components/SelectField";
import Text from "@/components/Text";
import TextArea from "@/components/TextArea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getFormEntries,
  getModuleById,
  getModules,
} from "@/services/api.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

const Modules = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const formEntriesQ = useQuery({
    queryKey: ["modules"],
    queryFn: getFormEntries,
  });

  const getModuleQ = useQuery({
    queryKey: ["module-id"],
    queryFn: () => getModuleById(params.name as string),
  });
  const currentModule = getModuleQ.isSuccess ? getModuleQ.data.data : {};
  const entries = formEntriesQ.isSuccess
    ? formEntriesQ.data.data.filter(
        (item) => item.moduleId == currentModule._id
      )
    : [];
  let formData: object = {};

  const customFields = {
    text: Text,
    textarea: TextArea,
    checkbox: CheckBox,
    radio: Radio,
    select: SelectField,
  };

  const handeSubmit = async (e) => {
    e.preventDefault();

    const newFormData = { formData, moduleId: params.name };

    const response = await fetch(`${BACKEND_URL}/api/v1/form-entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFormData),
    });
    const res = await response.json();

    queryClient.invalidateQueries({ queryKey: ["modules"] });
  };

  return (
    <div className="p-6">
      {getModuleQ.isSuccess && (
        <>
          <h3 className="text-xl font-semibold capitalize">
            {currentModule.name}
          </h3>

          <form onSubmit={handeSubmit}>
            <Card className="my-5 p-3">
              <CardContent className="space-y-4">
                {currentModule.blocks.map((item) => (
                  <fieldset className="p-4 rounded-lg border-4 space-y-4">
                    <legend>{item.name}</legend>
                    {item.fields?.map((field) => {
                      const Field = customFields[field.type];

                      return (
                        <Field
                          label={field.label}
                          mandatory={field.isMandatory.toString()}
                          options={field.options}
                          onChange={(e) => {
                            if (field.type == ("text" || "textarea")) {
                              formData[field.label] = e.target.value;
                            }
                            if (field.type == "checkbox") {
                              formData[field.label] = e.target.checked;
                            }
                            if (field.type == ("radio" || "select")) {
                              formData[field.label] = e;
                            }
                          }}
                        />
                      );
                    })}
                  </fieldset>
                ))}

                <div className="flex justify-end w-full space-x-3 p-3">
                  <Button
                    variant={"outline"}
                    type="reset"
                    className="uppercase"
                  >
                    Reset
                  </Button>
                  <Button type="submit" className="uppercase">
                    save changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </>
      )}

      {formEntriesQ.isSuccess && entries.length > 0 && (
        <div className="bg-white p-3 rounded-lg">
          <table>
            <thead>
              <th>sr no</th>
              <th>data</th>
            </thead>
            <tbody>
              {entries.map((item, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{JSON.stringify(item.formData)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Modules;

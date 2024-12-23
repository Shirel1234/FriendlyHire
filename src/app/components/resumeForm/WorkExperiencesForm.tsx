import { Form, FormSection } from "./form/Form";
import {
  Input,
  BulletListTextarea,
} from "./form/InputGroup";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/hooks";
import {
  changeWorkExperiences,
  selectWorkExperiences,
} from "@/app/lib/redux/resumeSlice";
import type { ResumeWorkExperience } from "@/app/lib/redux/types";

export const WorkExperiencesForm = () => {
  const workExperiences = useAppSelector(selectWorkExperiences);
  const dispatch = useAppDispatch();

  const showDelete = workExperiences.length > 1;

  return (
    <Form form="workExperiences" addButtonText="Add Job">
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        const handleWorkExperienceChange = <
        T extends keyof ResumeWorkExperience,
        V extends T extends "descriptions" ? string[] : string
      >(
          field: T,
          value: V
        ) => {
          // TS doesn't support passing union type to single call signature
          // https://github.com/microsoft/TypeScript/issues/54027
          // any is used here as a workaround
          if (field === "descriptions" && Array.isArray(value)) {
            dispatch(
              changeWorkExperiences({
                idx,
                field,
                value,
              } as {
                idx: number;
                field: "descriptions";
                value: string[];
              })
            );
          } else if (field !== "descriptions" && typeof value === "string") {
            dispatch(
              changeWorkExperiences({
                idx,
                field,
                value,
              } as {
                idx: number;
                field: Exclude<keyof ResumeWorkExperience, "descriptions">;
                value: string;
              }))}
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== workExperiences.length - 1;

        return (
          <FormSection
            key={idx}
            form="workExperiences"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Delete job"
          >
            <Input
              label="Company"
              labelClassName="col-span-full"
              name="company"
              placeholder="Khan Academy"
              value={company}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="Job Title"
              labelClassName="col-span-4"
              name="jobTitle"
              placeholder="Software Engineer"
              value={jobTitle}
              onChange={handleWorkExperienceChange}
            />
            <Input
              label="Date"
              labelClassName="col-span-2"
              name="date"
              placeholder="Jun 2022 - Present"
              value={date}
              onChange={handleWorkExperienceChange}
            />
            <BulletListTextarea
              label="Description"
              labelClassName="col-span-full"
              name="descriptions"
              placeholder="Bullet points"
              value={descriptions}
              onChange={handleWorkExperienceChange}
            />
          </FormSection>
        );
      })}
    </Form>
  );
};

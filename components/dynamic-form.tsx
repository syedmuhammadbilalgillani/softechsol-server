"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";
import { UploadIcon } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { ImageSelector } from "./image-selector";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { MultiSelect } from "./ui/multi-select";
import { PhoneInput } from "./ui/phone-input";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});
export interface FieldConfig {
  name: string;
  label: string;
  type:
    | "input"
    | "textarea"
    | "select"
    | "logo"
    | "cover"
    | "radio"
    | "switch"
    | "currencyInput"
    | "countryPhone"
    | "joditEditor" // Add this new type
    | "media" // Add this new type
    | "multiSelect"; // Add this new type

  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  InputType?: string;
  className?: string;
  defaultCurrency?: string;
  onCurrencyChange?: (value: string) => void;
  onImageSelect?: (file: File) => void;
  maxCount?: number; // Add this for multi-select
  animation?: number; // Add this for multi-select
}

interface StepConfig {
  title?: string;
  fields: FieldConfig[];
}

interface DynamicFormProps {
  fields?: FieldConfig[];
  steps?: StepConfig[];
  onSubmit: (data: any) => void;
  parentClassName?: string;
  submitButton?: React.ReactNode;
  formId?: string;
  defaultValues?: Record<string, any>;
  isUpdateMode?: boolean;
}

export const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  steps,
  onSubmit,
  parentClassName,
  submitButton,
  formId = "dynamic-form",
  defaultValues = {},
  isUpdateMode = false,
}) => {
  const methods = useForm({
    defaultValues,
    mode: "onChange", // or 'onBlur'
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitted },
    setValue,
    reset, // Add reset to handle form reset
  } = methods;

  const [currentStep, setCurrentStep] = useState(0);
  const isMultiStep = !!steps && steps.length > 0;
  const currentFields = isMultiStep ? steps[currentStep].fields : fields || [];

  // Add effect to handle defaultValues updates
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      reset(defaultValues); // Use reset instead of setValue for better handling
    }
  }, [defaultValues, reset, isUpdateMode]);
  const handleNext = () => {
    if (currentStep < (steps?.length || 1) - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderFields = (fields: FieldConfig[]) => {
    return fields.map((field, index) => {
      const isRequired = field.required;
      const error = errors[field.name]?.message as string;
      const showError = isSubmitted && error;

      switch (field.type) {
        case "input":
          return (
            <div key={field.name} className={field.className}>
              <Label className="block font-medium text-sm mb-1">
                {field.label}
              </Label>
              <Input
                type={
                  field?.InputType === "slug"
                    ? "text"
                    : field?.InputType ?? "text"
                }
                {...register(field.name, {
                  required: isRequired && `${field.label} is required`,
                  onChange: (e) => {
                    if (field?.InputType === "slug") {
                      const value = e.target.value
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9\s-]/g, "")
                        .trim()
                        .replace(/\s+/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-+|-+$/g, "");
                      setValue(field.name, value);
                    } else if (field?.InputType === "comma") {
                      // Handle comma separation
                      let value = e.target.value;

                      // If the last character is a space, add a comma
                      if (value.endsWith(" ")) {
                        value = value.trim() + ",";
                      }

                      // If the last character is a comma, don't add another one
                      if (value.endsWith(",")) {
                        setValue(field.name, value);
                        return;
                      }

                      // Remove any extra spaces around commas
                      value = value.replace(/\s*,\s*/g, ",");

                      setValue(field.name, value);
                    }
                  },
                })}
                placeholder={field.placeholder || field.label}
              />
              {showError && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
          );
        case "textarea":
          return (
            <div key={field.name} className={field.className}>
              <Label className="block font-medium text-sm mb-1">
                {field.label}
              </Label>
              <Textarea
                {...register(field.name, {
                  required: isRequired && `${field.label} is required`,
                })}
                placeholder={field.placeholder || field.label}
                rows={5}
              />
              {showError && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
          );

        // ... existing code ...
        case "select":
          return (
            <div key={field.name} className={field.className}>
              <Label className="block font-medium text-sm mb-1">
                {field.label}
              </Label>
              <Select
                onValueChange={(val) => {
                  const currentValue = methods.watch(field.name);
                  const newValue =
                    val === currentValue?.toString()
                      ? null
                      : val === "true"
                      ? true
                      : val === "false"
                      ? false
                      : val;
                  setValue(field.name, newValue);
                }}
                value={methods.watch(field.name)?.toString()}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center justify-between w-full">
                    <SelectValue
                      placeholder={field.placeholder || `Select ${field.label}`}
                    />
                    {methods.watch(field.name) && (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setValue(field.name, null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            setValue(field.name, null);
                          }
                        }}
                        className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showError && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
          );
        // ... existing code ...
        // ... existing code ...

        case "radio":
          return (
            <div key={index} className={field.className}>
              <Label className="block font-medium text-sm mb-1">
                {field.label}
              </Label>
              <RadioGroup
                onValueChange={(val) => setValue(field.name, val)}
                defaultValue={methods.watch(field.name)}
                className="flex flex-col gap-2"
              >
                {field.options?.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={opt.value}
                      id={`${field.name}-${opt.value}`}
                    />
                    <Label htmlFor={`${field.name}-${opt.value}`}>
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {showError && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
          );

        case "switch":
          return (
            <div
              key={index}
              className={`flex items-center justify-between ${
                field.className ?? ""
              }`}
            >
              <label htmlFor={field.name} className="text-sm font-medium">
                {field.label}
              </label>
              <Switch
                id={field.name}
                checked={!!methods.watch(field.name)}
                onCheckedChange={(checked: any) =>
                  setValue(field.name, checked)
                }
              />
            </div>
          );

        case "currencyInput":
          return (
            <div
              key={index}
              className={`flex items-center justify-between ${
                field.className ?? ""
              }`}
            >
              <CurrencyInput
                amountName={field.label}
                currencyName={field.name}
                currencies={[
                  { code: "USD", symbol: "$" },
                  { code: "EUR", symbol: "€" },
                  { code: "PKR", symbol: "₨" },
                ]}
              />
            </div>
          );

        case "countryPhone":
          return (
            <div key={index} className={`${field.className ?? ""}`}>
              <FormField
                control={methods.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <PhoneInput
                      value={formField.value}
                      onChange={(value) => formField.onChange(value)}
                      placeholder={field.placeholder || field.label}
                      defaultCountry="US"
                    />
                    {showError && <FormMessage />}
                  </FormItem>
                )}
              />
            </div>
          );

        case "joditEditor":
          return (
            <div key={field.name} className={field.className}>
              <Label className="block font-medium text-sm mb-1">
                {field.label}
              </Label>
              <JoditEditorComponent
                name={field.name}
                placeholder={field.placeholder}
                required={field.required}
              />
              {showError && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
          );
        case "media":
          return (
            <div key={field.name} className={field.className}>
              <Label className="block font-medium text-sm mb-1">
                {field.label}
              </Label>
              <ImageSelector
                name={field.name}
                // placeholder={field.placeholder || "Select an image..."}
              />
              {showError && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
          );
        case "multiSelect":
          return (
            <div key={field.name} className={field.className}>
              <Label className="block font-medium text-sm mb-1">
                {field.label}
              </Label>
              <MultiSelect
                options={field.options || []}
                onValueChange={(values) => setValue(field.name, values)}
                defaultValue={methods.watch(field.name) || []}
                placeholder={field.placeholder || `Select ${field.label}`}
                maxCount={field.maxCount || 3}
                animation={field.animation || 0}
              />
              {showError && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>
          );
        default:
          return null;
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className={`${parentClassName ? parentClassName : "grid gap-4"}`}
      >
        {renderFields(currentFields)}
      </form>
      {isMultiStep ? (
        <div className="flex w-full gap-4 mt-4">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handlePrevious}
            >
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              className="flex-1"
              onClick={handleNext}
              disabled={currentFields.some(
                (field) => field.required && !methods.watch(field.name)
              )}
            >
              Next
            </Button>
          ) : (
            submitButton || (
              <Button
                type="submit"
                onClick={methods.handleSubmit(onSubmit)}
                className="flex-1"
              >
                Submit
              </Button>
            )
          )}
        </div>
      ) : (
        submitButton
      )}
    </FormProvider>
  );
};

const JoditEditorComponent: React.FC<{
  name: string;
  placeholder?: string;
  required?: boolean;
}> = ({ name, placeholder, required }) => {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const content = watch(name);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const error = errors[name]?.message as string;
  const showError = error;
  const editor = useRef(null);

  // Function to get current theme
  const getCurrentTheme = () => {
    const root = document.documentElement;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const storedTheme = Cookies.get("theme");

    if (storedTheme === "system") {
      return systemDark ? "dark" : "light";
    }
    return storedTheme === "dark" ? "dark" : "light";
  };

  // Initial theme setup
  useEffect(() => {
    setCurrentTheme(getCurrentTheme());

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      setCurrentTheme(getCurrentTheme());
    });

    // Observe both data-theme attribute and class changes
    const root = document.documentElement;
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (Cookies.get("theme") === "system") {
        setCurrentTheme(getCurrentTheme());
      }
    };
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, []);
  const config = useMemo(
    () => ({
      toolbarAdaptive: false,
      readonly: false,
      toolbar: true,
      theme: currentTheme, // Use the current theme state
      placeholder: placeholder,
      // mobileView: {
      //   list: [
      //     { value: 320, title: "iPhone 5" },
      //     { value: 360, title: "iPhone 6" },
      //     { value: 768, title: "iPad" },
      //     { value: 1024, title: "Desktop" },
      //   ],
      // },
      // imageDefaultWidth: 300,
      // imageDefaultAlign: "left",
      // imageDefaultMargin: 10,
      // tableDefaultWidth: "100%",
      // tableDefaultCellPadding: 5,
      // preview: true,
      // tableDefaultCellSpacing: 0,
      // tableDefaultBorder: 1,
    }),
    [placeholder, currentTheme, name, setValue]
  ) as any;

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={10} // tabIndex of textarea
        onBlur={(newContent) => {
          setValue(name, newContent, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
      />
      {showError && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Logo Upload Component
interface LogoUploadProps {
  name: string;
  label?: string;
  helperText?: string;
}

const LogoUpload: React.FC<LogoUploadProps> = ({
  name,
  label = "Upload Logo",
  helperText = "Supported formats: JPEG, PNG, SVG",
}) => {
  const { register, setValue, watch } = useFormContext();
  const file = watch(name) as File | undefined;
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected instanceof File) {
      setValue(name, selected, { shouldValidate: true });
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  return (
    <div className="flex flex-col w-fit mb-6 col-span-full">
      <div className="size-[101px] rounded-xl mb-2.5 bg-gray-300 flex items-center justify-center overflow-hidden">
        {preview ? (
          <img
            src={preview}
            alt="Logo Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-dark-blue text-sm font-medium">
            <UploadIcon />
            Logo Here
          </div>
        )}
      </div>

      <label className="flex justify-center rounded-lg items-center px-3 py-2 bg-light-white border border-gray-100 text-dark-blue text-sm font-medium mb-1.5 cursor-pointer">
        <UploadIcon />
        {label}
        <input
          type="file"
          className="hidden"
          {...register(name)}
          onChange={handleChange}
        />
      </label>

      <span className="font-normal text-gray-400">{helperText}</span>
    </div>
  );
};

// Currency Input Component
type Currency = {
  code: string;
  symbol: string;
};

interface CurrencyInputProps {
  amountName: string;
  currencyName: string;
  label?: string;
  currencies: Currency[];
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  amountName,
  currencyName,
  label = "Amount",
  currencies,
}) => {
  const { control, watch, setValue } = useFormContext();
  const selectedCurrency = watch(currencyName);

  const selectedSymbol =
    currencies.find((c) => c.code === selectedCurrency)?.symbol || "$";

  return (
    <FormField
      control={control}
      name={amountName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex rounded-md border border-gray-300 bg-background group w-full">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {selectedSymbol}
                </div>
                <Input
                  type="text"
                  placeholder="0.00"
                  className="pl-6 pr-2 py-2 h-full min-w-[10vw] border-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    field.onChange(value);
                  }}
                />
              </div>

              <FormField
                control={control}
                name={currencyName}
                render={({ field: currencyField }) => (
                  <Select
                    onValueChange={(value) => {
                      currencyField.onChange(value);
                    }}
                    value={currencyField.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-[80px] border-l-0 rounded-l-none">
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// ```"use client";
// import React from "react";
// import { DynamicForm, FieldConfig, StepConfig } from "./DynamicForm";
// import { Button } from "./ui/button";

// // Example 1: Single Form Configuration
// const singleFormFields: FieldConfig[] = [
//   {
//     name: "name",
//     label: "Event Name",
//     type: "input",
//     required: true,
//     placeholder: "Enter event name",
//   },
//   {
//     name: "description",
//     label: "Event Description",
//     type: "textarea",
//     required: true,
//     placeholder: "Describe the event",
//   },
//   {
//     name: "category",
//     label: "Category",
//     type: "select",
//     required: true,
//     options: [
//       { label: "Conference", value: "conference" },
//       { label: "Workshop", value: "workshop" },
//       { label: "Meetup", value: "meetup" },
//     ],
//     placeholder: "Select a category",
//   },
//   {
//     name: "visibility",
//     label: "Visibility",
//     type: "radio",
//     required: true,
//     options: [
//       { label: "Public", value: "public" },
//       { label: "Private", value: "private" },
//     ],
//   },
//   {
//     name: "isOnline",
//     label: "Online Event",
//     type: "switch",
//   },
//   {
//     name: "coverPhoto",
//     label: "Cover Photo",
//     type: "cover",
//   },
// ];

// // Example 2: Multi-Step Form Configuration
// const multiStepConfig: StepConfig[] = [
//   {
//     title: "Basic Information",
//     fields: [
//       {
//         name: "name",
//         label: "Event Name",
//         type: "input",
//         required: true,
//         placeholder: "Enter event name",
//       },
//       {
//         name: "category",
//         label: "Category",
//         type: "select",
//         required: true,
//         options: [
//           { label: "Conference", value: "conference" },
//           { label: "Workshop", value: "workshop" },
//           { label: "Meetup", value: "meetup" },
//         ],
//         placeholder: "Select a category",
//       },
//     ],
//   },
//   {
//     title: "Details",
//     fields: [
//       {
//         name: "description",
//         label: "Event Description",
//         type: "textarea",
//         required: true,
//         placeholder: "Describe the event",
//       },
//       {
//         name: "visibility",
//         label: "Visibility",
//         type: "radio",
//         required: true,
//         options: [
//           { label: "Public", value: "public" },
//           { label: "Private", value: "private" },
//         ],
//       },
//     ],
//   },
//   {
//     title: "Media",
//     fields: [
//       {
//         name: "coverPhoto",
//         label: "Cover Photo",
//         type: "cover",
//       },
//       {
//         name: "isOnline",
//         label: "Online Event",
//         type: "switch",
//       },
//     ],
//   },
// ];

// // Example Component Using DynamicForm
// const FormUsageExample: React.FC = () => {
//   // Handle form submission
//   const handleSingleFormSubmit = (data: any) => {
//     // console.log("Single Form Submission:", data);
//     alert(JSON.stringify(data, null, 2));
//   };

//   const handleMultiStepFormSubmit = (data: any) => {
//     // console.log("Multi-Step Form Submission:", data);
//     alert(JSON.stringify(data, null, 2));
//   };

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       {/* Single Form Example */}
//       <h2 className="text-2xl font-bold mb-4">Single Form Example</h2>
//       <DynamicForm
//         fields={singleFormFields}
//         onSubmit={handleSingleFormSubmit}
//         parentClassName="grid gap-6"
//         submitButton={<Button type="submit">Save Event</Button>}
//         formId="single-form"
//       />

//       {/* Multi-Step Form Example */}
//       <h2 className="text-2xl font-bold mb-4 mt-12">Multi-Step Form Example</h2>
//       <DynamicForm
//         steps={multiStepConfig}
//         onSubmit={handleMultiStepFormSubmit}
//         parentClassName="grid gap-6"
//         formId="multi-step-form"
//       />
//     </div>
//   );
// };

// export default FormUsageExample;
// ```

// ##########################################################################

// "use client";

// import React from "react";
// import { DynamicForm, FieldConfig, StepConfig } from "./dynamic-form";
// import { Button } from "./ui/button";

// const FormExample = () => {
//   // Handle image selection for cover photo
//   const handleCoverPhotoSelect = (file: File) => {
//     console.log('Cover photo selected:', file);
//     // You can handle the file here (e.g., convert to base64, upload to server, etc.)
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const base64String = reader.result;
//       console.log('Base64:', base64String);
//     };
//     reader.readAsDataURL(file);
//   };

//   // Handle image selection for logo
//   const handleLogoSelect = (file: File) => {
//     console.log('Logo selected:', file);
//     // Handle logo file
//   };

//   // Handle currency change
//   const handleCurrencyChange = (value: string) => {
//     console.log('Currency changed:', value);
//   };

//   // Single form fields configuration
//   const formFields: FieldConfig[] = [
//     {
//       name: "title",
//       label: "Event Title",
//       type: "input",
//       required: true,
//       placeholder: "Enter event title",
//       className: "col-span-2"
//     },
//     {
//       name: "description",
//       label: "Event Description",
//       type: "textarea",
//       required: true,
//       placeholder: "Describe your event",
//       className: "col-span-2"
//     },
//     {
//       name: "category",
//       label: "Event Category",
//       type: "select",
//       required: true,
//       options: [
//         { label: "Conference", value: "conference" },
//         { label: "Workshop", value: "workshop" },
//         { label: "Meetup", value: "meetup" },
//         { label: "Webinar", value: "webinar" }
//       ],
//       placeholder: "Select a category",
//       className: "col-span-1"
//     },
//     {
//       name: "eventType",
//       label: "Event Type",
//       type: "radio",
//       required: true,
//       options: [
//         { label: "In-Person", value: "in-person" },
//         { label: "Virtual", value: "virtual" },
//         { label: "Hybrid", value: "hybrid" }
//       ],
//       className: "col-span-2"
//     },
//     {
//       name: "isPaid",
//       label: "Paid Event",
//       type: "switch",
//       className: "col-span-1"
//     },
//     {
//       name: "ticketPrice",
//       label: "Ticket Price",
//       type: "currencyInput",
//       required: true,
//       defaultCurrency: "USD",
//       onCurrencyChange: handleCurrencyChange,
//       className: "col-span-1"
//     },
//     {
//       name: "contactPhone",
//       label: "Contact Phone",
//       type: "countryPhone",
//       required: true,
//       placeholder: "Enter contact phone number",
//       className: "col-span-2"
//     },
//     {
//       name: "logo",
//       label: "Event Logo",
//       type: "logo",
//       required: true,
//       className: "col-span-1"
//     },
//     {
//       name: "coverPhoto",
//       label: "Cover Photo",
//       type: "cover",
//       required: true,
//       onImageSelect: handleCoverPhotoSelect,
//       className: "col-span-2"
//     }
//   ];

//   // Multi-step form configuration
//   const multiStepConfig: StepConfig[] = [
//     {
//       title: "Basic Information",
//       fields: [
//         {
//           name: "title",
//           label: "Event Title",
//           type: "input",
//           required: true,
//           placeholder: "Enter event title"
//         },
//         {
//           name: "description",
//           label: "Event Description",
//           type: "textarea",
//           required: true,
//           placeholder: "Describe your event"
//         },
//         {
//           name: "category",
//           label: "Event Category",
//           type: "select",
//           required: true,
//           options: [
//             { label: "Conference", value: "conference" },
//             { label: "Workshop", value: "workshop" },
//             { label: "Meetup", value: "meetup" }
//           ]
//         }
//       ]
//     },
//     {
//       title: "Event Details",
//       fields: [
//         {
//           name: "eventType",
//           label: "Event Type",
//           type: "radio",
//           required: true,
//           options: [
//             { label: "In-Person", value: "in-person" },
//             { label: "Virtual", value: "virtual" },
//             { label: "Hybrid", value: "hybrid" }
//           ]
//         },
//         {
//           name: "isPaid",
//           label: "Paid Event",
//           type: "switch"
//         },
//         {
//           name: "ticketPrice",
//           label: "Ticket Price",
//           type: "currencyInput",
//           required: true,
//           defaultCurrency: "USD"
//         }
//       ]
//     },
//     {
//       title: "Contact & Media",
//       fields: [
//         {
//           name: "contactPhone",
//           label: "Contact Phone",
//           type: "countryPhone",
//           required: true
//         },
//         {
//           name: "logo",
//           label: "Event Logo",
//           type: "logo",
//           required: true
//         },
//         {
//           name: "coverPhoto",
//           label: "Cover Photo",
//           type: "cover",
//           required: true,
//           onImageSelect: handleCoverPhotoSelect
//         }
//       ]
//     }
//   ];

//   // Form submission handlers
//   const handleSingleFormSubmit = (data: any) => {
//     console.log('Single Form Data:', data);
//     // Handle form submission
//   };

//   const handleMultiStepFormSubmit = (data: any) => {
//     console.log('Multi-Step Form Data:', data);
//     // Handle form submission
//   };

//   // Default values for update mode
//   const defaultValues = {
//     title: "Sample Event",
//     description: "This is a sample event description",
//     category: "conference",
//     eventType: "in-person",
//     isPaid: true,
//     ticketPrice: "100",
//     contactPhone: "+1234567890"
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-8">
//       {/* Single Form Example */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-6">Single Form Example</h2>
//         <DynamicForm
//           fields={formFields}
//           onSubmit={handleSingleFormSubmit}
//           parentClassName="grid grid-cols-2 gap-6"
//           submitButton={
//             <Button type="submit" className="w-full mt-4">
//               Create Event
//             </Button>
//           }
//           defaultValues={defaultValues}
//           isUpdateMode={true}
//         />
//       </div>

//       {/* Multi-Step Form Example */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-6">Multi-Step Form Example</h2>
//         <DynamicForm
//           steps={multiStepConfig}
//           onSubmit={handleMultiStepFormSubmit}
//           parentClassName="grid gap-6"
//           formId="multi-step-form"
//         />
//       </div>
//     </div>
//   );
// };

// export default FormExample;

import { FieldError, UseFormRegister } from "react-hook-form";

export type ValidFieldNames =
  | "email"
  | "password"
  | "passwordConfirm";

export type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
};
export type FormFieldProps = {
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<any>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
  className?: string;
};


const FormField: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
  className,
}) => (
  <>
    <input
      type={type}
      placeholder={placeholder}
      {...register(name, { valueAsNumber })}
      className={className}
    />
    {error && <span className="text-red-500 text-xs italic">{error.message}</span>}
  </>
);
export default FormField;
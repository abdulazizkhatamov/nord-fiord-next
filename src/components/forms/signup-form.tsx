"use client";
import React from "react";
import z from "zod";
import { Alert, Button, PasswordInput, TextInput } from "@mantine/core";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { signUp } from "@/lib/auth-client";

// Validation schema including name and confirmPassword
const validationSchema = z
  .object({
    name: z
      .string()
      .min(2, { error: "Имя должно содержать минимум 2 символа" })
      .max(50, { error: "Имя не должно превышать 50 символов" }),
    email: z
      .string()
      .min(3, { error: "Email должен содержать не менее 3 символов" })
      .max(50, { error: "Email не должен превышать 50 символов" })
      .email({ error: "Введите корректный Email" }),
    password: z
      .string()
      .min(8, { error: "Пароль должен содержать хотя бы 8 символов" })
      .max(64, { error: "Длина пароля не должна превышать 64 символа" })
      .regex(/[A-Z]/, {
        error: "Пароль должен содержать хотя бы одну заглавную букву",
      })
      .regex(/[a-z]/, {
        error: "Пароль должен содержать хотя бы одну строчную букву",
      })
      .regex(/[0-9]/, { error: "Пароль должен содержать хотя бы одну цифру" })
      .regex(/[!@#$%^&*]/, {
        error:
          "Пароль должен содержать хотя бы один специальный символ: ! @ # $ % ^ & *",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли должны совпадать",
  });

export default function SignUpForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: zod4Resolver(validationSchema),
    validateInputOnBlur: true,
  });

  const handleSubmit = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    const { error } = await signUp.email({
      name: form.getValues().name,
      email: form.getValues().email,
      password: form.getValues().password,
      callbackURL: "/admin",
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {/* Server error alert */}
      {serverError && (
        <Alert
          color="red"
          variant="filled"
          title="Ошибка"
          mb="md"
          withCloseButton
          onClose={() => setServerError(null)}
        >
          {serverError}
        </Alert>
      )}

      <TextInput
        withAsterisk
        label="Имя"
        placeholder="Введите имя"
        {...form.getInputProps("name")}
      />

      <TextInput
        withAsterisk
        label="Email"
        placeholder="Введите email"
        mt="md"
        {...form.getInputProps("email")}
      />

      <PasswordInput
        mt="md"
        withAsterisk
        label="Пароль"
        placeholder="Введите пароль"
        {...form.getInputProps("password")}
      />

      <PasswordInput
        mt="md"
        withAsterisk
        label="Подтвердите пароль"
        placeholder="Повторите пароль"
        {...form.getInputProps("confirmPassword")}
      />

      <Button fullWidth mt="xl" type="submit">
        Зарегистрироваться
      </Button>
    </form>
  );
}

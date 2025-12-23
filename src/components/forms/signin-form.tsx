"use client";
import React from "react";
import z from "zod";
import { Alert, Button, PasswordInput, TextInput, Group } from "@mantine/core";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { signIn } from "@/lib/auth-client";

// Validation schema
const validationSchema = z.object({
  email: z
    .string()
    .min(3, { error: "Email должен содержать не менее 3 символов" })
    .max(50, { error: "Email не должен превышать 50 символов" })
    .email({ error: "Введите корректный Email" }),
  password: z
    .string()
    .min(8, { error: "Пароль должен содержать не менее 8 символов" })
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
});

export default function SignInForm() {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zod4Resolver(validationSchema),
    validateInputOnBlur: true,
  });

  const handleSubmit = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) return;

    setServerError(null); // reset previous server errors

    const { error } = await signIn.email({
      email: form.getValues().email,
      password: form.getValues().password,
      rememberMe: true,
      callbackURL: "/admin",
    });

    if (error) {
      setServerError(error.message || "Что-то пошло не так.");
    }
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
        label="Email"
        placeholder="Введите email"
        {...form.getInputProps("email")}
      />

      <PasswordInput
        mt="md"
        withAsterisk
        label="Пароль"
        placeholder="Введите пароль"
        {...form.getInputProps("password")}
      />

      <Group mt="xl">
        <Button type="submit">Войти в систему</Button>
      </Group>
    </form>
  );
}

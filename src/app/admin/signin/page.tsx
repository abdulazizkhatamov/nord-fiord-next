import React from "react";
import { Box, Container, Paper, Text, Title } from "@mantine/core";
import classes from "./page.module.css";
import SignInForm from "@/components/forms/signin-form";

export default async function Page() {
  return (
    <Container size={420}>
      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <Title ta="center" className={classes.title}>
          Добро пожаловать!
        </Title>
        <Text className={classes.subtitle}>Войдите в свой аккаунт</Text>
        <Box mt={"xl"}>
          <SignInForm />
        </Box>
      </Paper>
    </Container>
  );
}

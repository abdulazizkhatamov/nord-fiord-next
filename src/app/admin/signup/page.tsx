import React from "react";
import { Box, Container, Paper, Text, Title } from "@mantine/core";
import classes from "./page.module.css";
import SignUpForm from "@/components/forms/signup-form";

export default async function Page() {
  return (
    <Container size={420}>
      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <Title ta="center" className={classes.title}>
          Добро пожаловать!
        </Title>
        <Text className={classes.subtitle}>Зарегистрироваться</Text>
        <Box mt={"xl"}>
          <SignUpForm />
        </Box>
      </Paper>
    </Container>
  );
}

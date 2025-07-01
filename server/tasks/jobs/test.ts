interface Step {
  run(name: string, callback: () => Promise<any>): Promise<any>;
}

export const testJob = async ({ event, step }: { event: any, step: Step }) => {
  const message = `✅ Job '${event.name}' executado com sucesso!`;

  console.log("=============================================");
  console.log(message);
  console.log("Evento recebido:", event);
  console.log("=============================================");

  await step.run("finalizar-job", async () => {
    // Aqui você poderia, por exemplo, salvar algo no banco de dados.
    return { status: "concluído", message };
  });

  return { body: message };
};
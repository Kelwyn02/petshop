'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import z from 'zod';

const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),
  description: z.string(),
  scheduleAt: z.date(),
});

type AppointmentData = z.infer<typeof appointmentSchema>;

export async function CreateAppointment(data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduleAt } = parsedData;
    const hour = scheduleAt.getHours();

    const isMorning = hour >= 9 && hour < 12;
    const isAfternoon = hour >= 13 && hour < 18;
    const isEvening = hour >= 19 && hour < 23;

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'Agendamentos só podem ser feitos entre 9h e 12h, 13h e 18h ou 19h e 23h',
      };
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduleAt,
      },
    });

    if (existingAppointment) {
      return {
        error: 'Este horário já está reservado',
      };
    }

    await prisma.appointment.create({
      data: {
        ...parsedData,
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.log(error);
  }

  return {
    error: 'Erro ao criar o agendamento. Tente novamente.',
  };
}

export async function UpdateAppointment(id: string, data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduleAt } = parsedData;
    const hour = scheduleAt.getHours();

    const isMorning = hour >= 9 && hour < 12;
    const isAfternoon = hour >= 13 && hour < 18;
    const isEvening = hour >= 19 && hour < 23;

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'Agendamentos só podem ser feitos entre 9h e 12h, 13h e 18h ou 19h e 23h',
      };
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduleAt,
        id: {
          not: id,
        },
      },
    });

    if (existingAppointment) {
      return {
        error: 'Este horário já está reservado',
      };
    }

    await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        ...parsedData,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.log(error);
  }

  return {
    error: 'Erro ao atualizar o agendamento. Tente novamente.',
  };
}

export async function DeleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({
      where: {
        id,
      },
    });
    revalidatePath('/');
  } catch (error) {
    console.log(error);
    return {
      error: 'Erro ao remover o agendamento. Tente novamente.',
    };
  }
}

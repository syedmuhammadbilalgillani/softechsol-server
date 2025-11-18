import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// POST - Create a new ContactUs submission
export async function POST(req: Request) {
  const { name, email, phone, service_id, notes }: { 
    name: string; 
    email: string; 
    phone: string; 
    service_id?: number; 
    notes?: string;
  } = await req.json();

  try {
    const contactSubmission = await prisma.contactUs.create({
      data: {
        name,
        email,
        phone,
        service_id,
        notes,
      },
    });
    return NextResponse.json(contactSubmission, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create contact submission.' }, { status: 500 });
  }
}

// DELETE - Delete a ContactUs submission
export async function DELETE(req: Request) {
  const { contact_id }: { contact_id: number } = await req.json();

  try {
    const deletedContact = await prisma.contactUs.delete({
      where: {
        contact_id,
      },
    });
    return NextResponse.json(deletedContact, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contact submission.' }, { status: 500 });
  }
}

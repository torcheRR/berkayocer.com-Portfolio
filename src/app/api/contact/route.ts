import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { ok: false, error: "Lütfen tüm alanları doldurun." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Portfolio Form <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `[Portfolio] ${subject}`,
      replyTo: email,
      text: `Ad Soyad: ${name}\nE-posta: ${email}\n\nMesaj:\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("/api/contact error", error);
    return NextResponse.json(
      { ok: false, error: "Mesaj gönderilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

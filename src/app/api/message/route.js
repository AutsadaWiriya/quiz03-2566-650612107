import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async (request) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");
  const roomMessege = DB.messages.find( std => std.roomId === roomId )
  if( !roomMessege ){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageRoom = [];
  for( const mes of DB.messages){
    if( mes.roomId === roomId ){
      messageRoom.push(mes);
    }
  }

  return NextResponse.json(
    {
      ok: true,
      message: messageRoom,
    }
  );
};

export const POST = async (request) => {
  readDB();
  const body = await request.json();
  const { roomId , messageText } = body;
  
  const roomC = DB.rooms.find( std => std.roomId === roomId)
  if( !roomC ){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();
  DB.messages.push(
    {
      roomId: roomId,
      messageId: messageId,
      messageText: messageText
    }
  )
  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request) => {
  const payload = checkToken();
  if( payload == null ){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();
  const body = await request.json();
  const { messageId } = body;
  const messageFound = DB.messages.find( std => std.messageId === messageId)

  if( !messageFound ){
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }
  DB.messages = DB.messages.filter( std => std.messageId !== messageId);
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};

import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  const roomList = [];
  for (const enroll of DB.rooms) {
    roomList.push(enroll);
  }
  return NextResponse.json({
    ok: true,
    rooms: roomList,
    totalRooms: roomList.length
  });
};

export const POST = async (request) => {
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
  const { roomName } = body;
  const roomNameList = DB.rooms.find( std => std.roomName === body.roomName );
  if( roomNameList ){
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${"replace this with room name"} already exists`,
      },
      { status: 400 }
    );
  }
  const roomId = nanoid();

  DB.rooms.push(
    {
      roomId: roomId,
      roomName: roomName
    }
  )
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${"replace this with room name"} has been created`,
  });
};

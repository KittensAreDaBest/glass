// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as Yup from 'yup';

type Data = {
  success: boolean,
  data: any,
}

const schema = Yup.object().shape({
  target: Yup.string(),
  type: Yup.string().oneOf(["mtr", "traceroute", "ping", "bgp"])
});
type RequestData = {
  target: string,
  type: string
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const body = req.body as RequestData
  try {
    await schema.validate(body, { abortEarly: false })
  } catch (error: any) {
    res.status(400).json({ success: false, data: error })
    return
  }
  const payload = body.target
  const command = body.type
  let cmd = ""
  let args: string[] = []
  let v4_regex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/gm
  let v6_regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/gm
  let domain_regex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/gm
  switch (command) {
    case "mtr":
      args = ["-c", "4", "--report", "--report-wide", payload]
      cmd = "/usr/bin/mtr";
      break;
    case "traceroute":
      args = ["-w2", payload]
      cmd = "/usr/bin/traceroute";
      break;
    case "ping":
      args = ["-c", "4", "-w15", payload]
      cmd = "/bin/ping";
      break;
    case "bgp":
      if (process.env.NEXT_PUBLIC_BGP_ENABLED != "true") {
        res.status(400).json({ success: false, data: "BGP commands are disabled" })
        return
      } else {
        args = ["-r", "sh", "ro", "all", "for", payload, "primary"]
        cmd = "/usr/sbin/birdc";
        break;
      }
  }
  if (cmd == "" || args.length == 0) {
    res.status(400).json({ success: false, data: "Invalid command" })
    return
  }
  if (v4_regex.test(payload) || v6_regex.test(payload) || domain_regex.test(payload)) {
    const { spawn } = require('child_process');
    const child = spawn(cmd, args);
    let output = ""
    child.stdout.on('data', (data: any) => {
      output += data.toString()
    });
    child.stderr.on('data', (data: any) => {
      output += data.toString()
    });
    await child.on('close', (code: any) => {
      res.status(200).json({ success: true, data: output })
    });
  } else {
    res.status(400).json({ success: false, data: "Invalid target" })
  }

}

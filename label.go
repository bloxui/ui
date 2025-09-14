package ui

import x "github.com/bloxui/blox"

func Label(args ...x.LabelArg) x.Component {
	classes := "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
	labelArgs := []x.LabelArg{x.Class(classes)}
	labelArgs = append(labelArgs, args...)

	return x.FormLabel(labelArgs...)
}

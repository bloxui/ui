package ui

import x "github.com/bloxui/blox"

func Label(args ...x.LabelArg) x.Component {
	classes := "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
	labelArgs := []x.LabelArg{x.Class(classes)}
	labelArgs = append(labelArgs, args...)

	return x.FormLabel(labelArgs...)
}

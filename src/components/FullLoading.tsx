import { Center, ElementType, Spinner, SpinnerProps } from "@hope-ui/solid"
import { JSXElement, mergeProps, Show } from "solid-js"
import { getMainColor } from "~/store"
export const FullScreenLoading = () => {
  return (
    <Center h="100vh">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="$neutral4"
        color={getMainColor()}
        size="xl"
      />
    </Center>
  )
}

export const FullLoading = () => {
  return (
    <Center w="$full" h="$full">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="$neutral4"
        color={getMainColor()}
        size="xl"
      />
    </Center>
  )
}

export const MaybeLoading = (props: {
  children?: JSXElement
  loading: boolean
}) => {
  return (
    <Show when={!props.loading} fallback={<FullLoading />}>
      {props.children}
    </Show>
  )
}

export const CenterLoading = <C extends ElementType = "div">(
  props: SpinnerProps<C>,
) => {
  return (
    <Center w="$full" h="$full">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="$neutral4"
        color={getMainColor()}
        size="xl"
      />
    </Center>
  )
}

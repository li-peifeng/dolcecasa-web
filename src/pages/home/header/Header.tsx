import {
  HStack,
  useColorModeValue,
  Image,
  Center,
  CenterProps,
  IconButton,
} from "@hope-ui/solid"
import { Show, Switch, Match, createMemo } from "solid-js"
import {
  getMainColor,
  layout,
  getSetting,
  local,
  objStore,
  State,
} from "~/store"
import { changeColor } from "seemly"
import { CenterLoading } from "~/components"
import { Container } from "../Container"
import { bus } from "~/utils"
import { Layout } from "./layout"
import { AiOutlineFileSearch } from "solid-icons/ai"
import { TbListSearch } from "solid-icons/tb"
import { CgImage } from "solid-icons/cg"

export const Header = () => {
  const logos = getSetting("logo").split("\n")
  const logo = useColorModeValue(logos[0], logos.pop())

  const stickyProps = createMemo<CenterProps>(() => {
    switch (local["position_of_header_navbar"]) {
      case "sticky":
        return { position: "sticky", zIndex: "$sticky", top: 0 }
      default:
        return { position: undefined, zIndex: undefined, top: undefined }
    }
  })

  return (
    <Center
      {...stickyProps}
      bgColor="$background"
      class="header"
      w="$full"
      // shadow="$md"
    >
      <Container>
        <HStack
          px="calc(2% + 0.5rem)"
          py="$2"
          w="$full"
          justifyContent="space-between"
        >
          <HStack class="header-left" h="52px">
            <Image
              src={logo()!}
              h="$full"
              w="auto"
              fallback={<CenterLoading />}
            />
          </HStack>
          <HStack class="header-right" spacing="$2">
            <Show when={objStore.state === State.Folder}>
              <IconButton
                aria-label="Search"
                color={getMainColor()}
                bgColor={changeColor(getMainColor(), { alpha: 0.05 })}
                _hover={{
                  bgColor: changeColor(getMainColor(), { alpha: 0.2 }),
                }}
                compact
                size="xl"
                icon={
                  <Switch>
                    <Match when={layout() === "list"}>
                      <TbListSearch />
                    </Match>
                    <Match when={layout() === "grid"}>
                      <AiOutlineFileSearch />
                    </Match>
                    <Match when={layout() === "image"}>
                      <CgImage />
                    </Match>
                  </Switch>
                }
                onClick={() => {
                  bus.emit("tool", "search")
                }}
              />
              <Layout />
            </Show>
          </HStack>
        </HStack>
      </Container>
    </Center>
  )
}

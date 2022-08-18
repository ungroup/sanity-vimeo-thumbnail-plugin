import React from "react";
import {
  Inline,
  Button,
  Dialog,
  Text,
  TextInput,
  Box,
  Stack,
} from "@sanity/ui";
import styled from "styled-components";

const Img = styled.img`
  max-width: 600px;
  cursor: pointer;
`;

function VimeoThumbnail(props) {
  const vimeoAccessToken = process.env.SANITY_STUDIO_VIMEO_ACCESS_TOKEN;
  const [vimeoId, setVimeoId] = React.useState("");
  const [vimeoThumbSrc, setVimeoThumbSrc] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleSelect = () => {
    props.onSelect([
      {
        kind: "url",
        value: vimeoThumbSrc,
      },
    ]);
  };
  function onSubmit() {
    if (!vimeoId) {
      return;
    }
    getVimeoThumbnail(vimeoId);
  }

  async function getVimeoThumbnail(id) {
    if (!id) {
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${vimeoAccessToken}`);
    myHeaders.append("Content-Type", "text/plain");

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    const url = `https://api.vimeo.com/videos/${id}/pictures`;

    await fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result?.data[0]?.base_link) {
          setVimeoThumbSrc(result.data[0].base_link);
        } else {
          setErrorMsg("There was an error. Please check the Vimeo ID.");
        }
      })
      .catch((error) => setErrorMsg(`There was an error: ${error}`));
  }

  return (
    <Dialog
      id="vimeo-thumbnail"
      header="Get Vimeo Thumbnail"
      onClose={props.onClose}
      open
      width={2}
    >
      <Stack padding={4} space={4}>
        {vimeoAccessToken && (
          <>
            <Inline space={[3, 3, 4]}>
              <TextInput
                fontSize={[2, 2, 3]}
                onChange={(event) => setVimeoId(event.currentTarget.value)}
                padding={[3, 3, 4]}
                placeholder="Vimeo ID"
                value={vimeoId}
              />
              <Button
                fontSize={[2, 2, 3]}
                padding={[3, 3, 4]}
                onClick={onSubmit}
                text="Get Thumbnail"
                disabled={!vimeoId}
                tone="primary"
              />
            </Inline>
            {vimeoThumbSrc && (
              <Text as="p">Click this image to select it:</Text>
            )}
            <Box>
              {vimeoThumbSrc && (
                <Img src={vimeoThumbSrc} onClick={handleSelect} />
              )}
              {errorMsg && <Text as="p">{errorMsg}</Text>}
            </Box>
          </>
        )}
        {/* If no Access Token found */}
        {!vimeoAccessToken && <Text as="p">No Vimeo Access Token Found.</Text>}
      </Stack>
    </Dialog>
  );
}

export default VimeoThumbnail;
